import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { CURRENT_STORAGE_VERSION } from '../utils/theme';

export type ProjectStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

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

export interface MilestoneCompletion {
  milestoneId: string;
  completedAt: string;
}

export interface ProjectProgress {
  projectId: string;
  status: ProjectStatus;
  startedAt?: string;
  lastVisitedAt: string;
  completedAt?: string;
  milestoneCompletion: MilestoneCompletion[];
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
  projects?: ProjectProgress[];
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
  projects: {
    key: string;
    value: ProjectProgress;
  };
  meta: {
    key: string;
    value: { key: string; value: string | number };
  };
}

const DB_NAME = 'devturningpoint';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<DtpDb>> | null = null;

/** @internal test helper */
export function __resetProgressDbForTests(): void {
  dbPromise = null;
}

function getDb() {
  if (typeof indexedDB === 'undefined') {
    throw new Error('IndexedDB is not available in this environment');
  }
  if (!dbPromise) {
    dbPromise = openDB<DtpDb>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore('assessments', { keyPath: 'trackId' });
          db.createObjectStore('topics', { keyPath: 'topicId' });
          db.createObjectStore('paths', { keyPath: 'trackId' });
          db.createObjectStore('bookmarks', { keyPath: 'topicId' });
          db.createObjectStore('meta', { keyPath: 'key' });
        }
        if (oldVersion < 2 && !db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'projectId' });
        }
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
  const version = Number(existing.value);
  if (version < CURRENT_STORAGE_VERSION) {
    await db.put('meta', { key: 'storageVersion', value: CURRENT_STORAGE_VERSION });
  }
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

export function deriveProjectStatus(
  milestoneCompletion: MilestoneCompletion[],
  totalMilestones: number,
  explicit?: ProjectStatus,
): ProjectStatus {
  if (explicit === 'COMPLETED' || (totalMilestones > 0 && milestoneCompletion.length >= totalMilestones)) {
    return 'COMPLETED';
  }
  if (milestoneCompletion.length > 0 || explicit === 'IN_PROGRESS') return 'IN_PROGRESS';
  return 'NOT_STARTED';
}

export async function getProjectProgress(projectId: string): Promise<ProjectProgress | undefined> {
  await ensureStorageMigrated();
  const db = await getDb();
  return db.get('projects', projectId);
}

export async function getAllProjectProgress(): Promise<ProjectProgress[]> {
  await ensureStorageMigrated();
  const db = await getDb();
  return db.getAll('projects');
}

export async function touchProject(projectId: string): Promise<ProjectProgress> {
  await ensureStorageMigrated();
  const db = await getDb();
  const now = new Date().toISOString();
  const existing = await db.get('projects', projectId);
  const next: ProjectProgress = {
    projectId,
    status: existing?.status && existing.status !== 'NOT_STARTED' ? existing.status : 'IN_PROGRESS',
    startedAt: existing?.startedAt ?? now,
    lastVisitedAt: now,
    completedAt: existing?.completedAt,
    milestoneCompletion: existing?.milestoneCompletion ?? [],
  };
  await db.put('projects', next);
  return next;
}

export async function startProject(projectId: string): Promise<ProjectProgress> {
  await ensureStorageMigrated();
  const db = await getDb();
  const now = new Date().toISOString();
  const existing = await db.get('projects', projectId);
  const next: ProjectProgress = {
    projectId,
    status: existing?.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS',
    startedAt: existing?.startedAt ?? now,
    lastVisitedAt: now,
    completedAt: existing?.completedAt,
    milestoneCompletion: existing?.milestoneCompletion ?? [],
  };
  await db.put('projects', next);
  return next;
}

export async function toggleMilestoneComplete(
  projectId: string,
  milestoneId: string,
  totalMilestones: number,
): Promise<ProjectProgress> {
  await ensureStorageMigrated();
  const db = await getDb();
  const now = new Date().toISOString();
  const existing = await db.get('projects', projectId);
  const current = existing?.milestoneCompletion ?? [];
  const has = current.some((m) => m.milestoneId === milestoneId);
  const milestoneCompletion = has
    ? current.filter((m) => m.milestoneId !== milestoneId)
    : [...current, { milestoneId, completedAt: now }];
  const status = deriveProjectStatus(milestoneCompletion, totalMilestones);
  const next: ProjectProgress = {
    projectId,
    status,
    startedAt: existing?.startedAt ?? now,
    lastVisitedAt: now,
    completedAt: status === 'COMPLETED' ? existing?.completedAt ?? now : undefined,
    milestoneCompletion,
  };
  await db.put('projects', next);
  return next;
}

export async function markProjectComplete(projectId: string, milestoneIds: string[]): Promise<ProjectProgress> {
  await ensureStorageMigrated();
  const db = await getDb();
  const now = new Date().toISOString();
  const existing = await db.get('projects', projectId);
  const completedIds = new Set(existing?.milestoneCompletion.map((m) => m.milestoneId) ?? []);
  const milestoneCompletion = [
    ...(existing?.milestoneCompletion ?? []),
    ...milestoneIds
      .filter((id) => !completedIds.has(id))
      .map((milestoneId) => ({ milestoneId, completedAt: now })),
  ];
  const next: ProjectProgress = {
    projectId,
    status: 'COMPLETED',
    startedAt: existing?.startedAt ?? now,
    lastVisitedAt: now,
    completedAt: now,
    milestoneCompletion,
  };
  await db.put('projects', next);
  return next;
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
    projects: await db.getAll('projects'),
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
  if (obj.projects && !Array.isArray(obj.projects)) {
    return { ok: false, error: 'projects must be an array' };
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
    await db.clear('projects');
  }

  const tx = db.transaction(['assessments', 'topics', 'paths', 'bookmarks', 'projects', 'meta'], 'readwrite');
  for (const item of data.assessments) await tx.objectStore('assessments').put(item);
  for (const item of data.topics) await tx.objectStore('topics').put(item);
  for (const item of data.paths) await tx.objectStore('paths').put(item);
  for (const topicId of data.bookmarks ?? []) {
    await tx.objectStore('bookmarks').put({ topicId, createdAt: new Date().toISOString() });
  }
  for (const item of data.projects ?? []) await tx.objectStore('projects').put(item);
  await tx.objectStore('meta').put({ key: 'storageVersion', value: Math.max(data.schemaVersion, CURRENT_STORAGE_VERSION) });
  await tx.done;
}
