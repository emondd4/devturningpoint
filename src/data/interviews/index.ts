import catalogJson from './catalog.json' with { type: 'json' };
import foundations from './bank/foundations.json' with { type: 'json' };
import mobileFlutter from './bank/mobile-flutter.json' with { type: 'json' };
import frontend from './bank/frontend.json' with { type: 'json' };
import backend from './bank/backend.json' with { type: 'json' };
import fullstack from './bank/fullstack.json' with { type: 'json' };
import devops from './bank/devops.json' with { type: 'json' };
import database from './bank/database.json' with { type: 'json' };
import qa from './bank/qa.json' with { type: 'json' };
import uiux from './bank/uiux.json' with { type: 'json' };
import projectManagement from './bank/project-management.json' with { type: 'json' };
import type { BankQuestion, InterviewCatalog, InterviewTrackCatalog } from './types';
import { tracks } from '../tracks/tracks';

export type { BankQuestion, InterviewCatalog, InterviewLevel, InterviewTrackCatalog } from './types';

export const interviewCatalog = catalogJson as InterviewCatalog;

const banks: Record<string, BankQuestion[]> = {
  foundations: foundations as BankQuestion[],
  'mobile-flutter': mobileFlutter as BankQuestion[],
  frontend: frontend as BankQuestion[],
  backend: backend as BankQuestion[],
  fullstack: fullstack as BankQuestion[],
  devops: devops as BankQuestion[],
  database: database as BankQuestion[],
  qa: qa as BankQuestion[],
  uiux: uiux as BankQuestion[],
  'project-management': projectManagement as BankQuestion[],
};

export const interviewTrackSlugs = Object.keys(banks);

export function getInterviewTrack(slug: string): InterviewTrackCatalog | undefined {
  return interviewCatalog.tracks.find((t) => t.slug === slug);
}

export function getInterviewQuestions(slug: string): BankQuestion[] {
  return banks[slug] ?? [];
}

export function trackMetaForInterview(slug: string) {
  return tracks.find((t) => t.slug === slug);
}
