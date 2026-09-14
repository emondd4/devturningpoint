import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { CURRENT_STORAGE_VERSION } from '../utils/theme';

export interface AssessmentResult {
  trackId: string;
  completedAt: string;
  demonstrated: string[];
  uncertain: string[];
  missing: string[];
  recommendedStartId?: string;
  answers: Record<string, string | number | boolean>;
}

export interface TopicProgress {
  topicId: string;
  completed: boolean;
  completedAt?: string;
  lastSection?: string;
  lastVisitedAt: string;
}

export interface LearningPathState {
  trackId: string;
  orderedSkillIds: string[];
  currentTopicId?: string;
  currentSection?: string;
  lastVisitedAt: string;
  assessmentCompletedAt?: string;
}

export interface ProgressExport {
  schemaVersion: number;
  exportedAt: string;
  preferences?: {
    theme?: string;
    locale?: string;
  };
  assessments: AssessmentResult[];
  topics: TopicProgress[];
  paths: LearningPathState[];
  bookmarks: string[];
}

interface DtpDb extends DBSchema {
  assessments: {
    key: string;
    value: AssessmentResult;
  };
  topics: {
    key: string;
    value: TopicProgress;
  };
  paths: {
    key: string;
    value: LearningPathState;
  };
  bookmarks: {
    key: string;
    value: { topicId: string; createdAt: string };
  };
  meta: {
    key: string;
    value: { key: string; value: string | number };
  };
}

const DB_NAME = 'devturningpoint';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<DtpDb>> | null = null;

function getDb() {
  if (typeof indexedDB === 'undefined') {
    throw new Error('IndexedDB is not available in this environment');
  }
  if (!dbPromise) {
    dbPromise = openDB<DtpDb>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('assessments', { keyPath: 'trackId' });
        db.createObjectStore('topics', { keyPath: 'topicId' });
        db.createObjectStore('paths', { keyPath: 'trackId' });
        db.createObjectStore('bookmarks', { keyPath: 'topicId' });
        db.createObjectStore('meta', { keyPath: 'key' });
      },
    });
  }
  return dbPromise;
}

export async function ensureStorageMigrated(): Promise<void> {
  const db = await getDb();
  const existing = await db.get('meta', 'storageVersion');
  if (!existing) {
    await db.put('meta', { key: 'storageVersion', value: CURRENT_STORAGE_VERSION });
    return;
  }
  // Future migrations branch on Number(existing.value)
}

export async function saveAssessment(result: AssessmentResult): Promise<void> {
  await ensureStorageMigrated();
  const db = await getDb();
  await db.put('assessments', result);
}

export async function getAssessment(trackId: string): Promise<AssessmentResult | undefined> {
  await ensureStorageMigrated();
  const db = await getDb();
  return db.get('assessments', trackId);
}

export async function markTopicComplete(topicId: string, section?: string): Promise<void> {
  await ensureStorageMigrated();
  const db = await getDb();
  const now = new Date().toISOString();
  const existing = await db.get('topics', topicId);
  await db.put('topics', {
    topicId,
    completed: true,
    completedAt: now,
    lastSection: section ?? existing?.lastSection,
    lastVisitedAt: now,
  });
}

export async function touchTopic(topicId: string, section?: string): Promise<void> {
  await ensureStorageMigrated();
  const db = await getDb();
  const existing = await db.get('topics', topicId);
  await db.put('topics', {
    topicId,
    completed: existing?.completed ?? false,
    completedAt: existing?.completedAt,
    lastSection: section ?? existing?.lastSection,
    lastVisitedAt: new Date().toISOString(),
  });
}

export async function getTopicProgress(topicId: string): Promise<TopicProgress | undefined> {
  await ensureStorageMigrated();
  const db = await getDb();
  return db.get('topics', topicId);
}

export async function getAllTopicProgress(): Promise<TopicProgress[]> {
  await ensureStorageMigrated();
  const db = await getDb();
  return db.getAll('topics');
}

export async function savePath(path: LearningPathState): Promise<void> {
  await ensureStorageMigrated();
  const db = await getDb();
  await db.put('paths', path);
}

export async function getPath(trackId: string): Promise<LearningPathState | undefined> {
  await ensureStorageMigrated();
  const db = await getDb();
  return db.get('paths', trackId);
}

export async function getAllPaths(): Promise<LearningPathState[]> {
  await ensureStorageMigrated();
  const db = await getDb();
  return db.getAll('paths');
}

export async function clearTrackProgress(trackId: string, topicIds: string[]): Promise<void> {
  await ensureStorageMigrated();
  const db = await getDb();
  await db.delete('paths', trackId);
  await db.delete('assessments', trackId);
  const tx = db.transaction('topics', 'readwrite');
  for (const id of topicIds) {
    await tx.store.delete(id);
  }
  await tx.done;
}

export async function toggleBookmark(topicId: string): Promise<boolean> {
  await ensureStorageMigrated();
  const db = await getDb();
  const existing = await db.get('bookmarks', topicId);
  if (existing) {
    await db.delete('bookmarks', topicId);
    return false;
  }
  await db.put('bookmarks', { topicId, createdAt: new Date().toISOString() });
  return true;
}

export async function getBookmarks(): Promise<string[]> {
  await ensureStorageMigrated();
  const db = await getDb();
  const all = await db.getAll('bookmarks');
  return all.map((b) => b.topicId);
}

export async function exportProgress(preferences?: ProgressExport['preferences']): Promise<ProgressExport> {
  await ensureStorageMigrated();
  const db = await getDb();
  return {
    schemaVersion: CURRENT_STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    preferences,
    assessments: await db.getAll('assessments'),
    topics: await db.getAll('topics'),
    paths: await db.getAll('paths'),
    bookmarks: (await db.getAll('bookmarks')).map((b) => b.topicId),
  };
}

export function validateProgressImport(data: unknown): { ok: true; data: ProgressExport } | { ok: false; error: string } {
  if (!data || typeof data !== 'object') return { ok: false, error: 'Import must be a JSON object' };
  const obj = data as Record<string, unknown>;
  if (typeof obj.schemaVersion !== 'number') return { ok: false, error: 'Missing schemaVersion' };
  if (!Array.isArray(obj.assessments) || !Array.isArray(obj.topics) || !Array.isArray(obj.paths)) {
    return { ok: false, error: 'Missing assessments/topics/paths arrays' };
  }
  if (obj.bookmarks && !Array.isArray(obj.bookmarks)) {
    return { ok: false, error: 'bookmarks must be an array' };
  }
  return { ok: true, data: data as ProgressExport };
}

export async function importProgress(data: ProgressExport, mode: 'merge' | 'replace' = 'merge'): Promise<void> {
  await ensureStorageMigrated();
  const db = await getDb();

  if (mode === 'replace') {
    await db.clear('assessments');
    await db.clear('topics');
    await db.clear('paths');
    await db.clear('bookmarks');
  }

  const tx = db.transaction(['assessments', 'topics', 'paths', 'bookmarks', 'meta'], 'readwrite');
  for (const item of data.assessments) await tx.objectStore('assessments').put(item);
  for (const item of data.topics) await tx.objectStore('topics').put(item);
  for (const item of data.paths) await tx.objectStore('paths').put(item);
  for (const topicId of data.bookmarks ?? []) {
    await tx.objectStore('bookmarks').put({ topicId, createdAt: new Date().toISOString() });
  }
  await tx.objectStore('meta').put({ key: 'storageVersion', value: data.schemaVersion });
  await tx.done;
}
