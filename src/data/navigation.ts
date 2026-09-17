import type { Locale } from '../i18n/config';
import { localePath } from '../i18n/config';
import { tracks } from './tracks/tracks';
import { siteConfig } from '../config/site';

export type NavItem = {
  id: string;
  href: string;
  labelEn: string;
  labelBn: string;
  icon?: string;
  children?: NavItem[];
};

export function labelFor(item: Pick<NavItem, 'labelEn' | 'labelBn'>, locale: Locale): string {
  return locale === 'bn' ? item.labelBn : item.labelEn;
}

/** Primary desktop header links (top-level). */
export function getPrimaryNav(locale: Locale): NavItem[] {
  return [
    {
      id: 'learn',
      href: localePath(locale, 'tracks'),
      labelEn: 'Learn',
      labelBn: 'শেখা',
      icon: 'school',
      children: [
        {
          id: 'tracks-all',
          href: localePath(locale, 'tracks'),
          labelEn: 'All tracks',
          labelBn: 'সব ট্র্যাক',
          icon: 'account_tree',
        },
        ...tracks.map((track) => ({
          id: `track-${track.id}`,
          href: localePath(locale, `tracks/${track.slug}`),
          labelEn: track.title,
          labelBn: track.titleBn,
          icon: trackIcon(track.id),
        })),
      ],
    },
    {
      id: 'careers',
      href: localePath(locale, 'careers'),
      labelEn: 'Careers',
      labelBn: 'ক্যারিয়ার',
      icon: 'work',
      children: [
        {
          id: 'career-explorer',
          href: localePath(locale, 'careers'),
          labelEn: 'Career Explorer',
          labelBn: 'ক্যারিয়ার এক্সপ্লোরার',
          icon: 'work',
        },
        {
          id: 'job-market',
          href: localePath(locale, 'job-market'),
          labelEn: 'Bangladesh Tech Market',
          labelBn: 'বাংলাদেশ টেক মার্কেট',
          icon: 'map',
        },
        {
          id: 'companies',
          href: localePath(locale, 'companies'),
          labelEn: 'Companies',
          labelBn: 'কোম্পানি',
          icon: 'business',
        },
      ],
    },
    {
      id: 'roadmaps',
      href: localePath(locale, 'tracks'),
      labelEn: 'Roadmaps',
      labelBn: 'রোডম্যাপ',
      icon: 'route',
    },
    {
      id: 'projects',
      href: localePath(locale, 'projects'),
      labelEn: 'Projects',
      labelBn: 'প্রজেক্ট',
      icon: 'code',
    },
    {
      id: 'interviews',
      href: localePath(locale, 'interviews'),
      labelEn: 'Interview',
      labelBn: 'ইন্টারভিউ',
      icon: 'quiz',
    },
    {
      id: 'problem-solving',
      href: localePath(locale, 'problem-solving'),
      labelEn: 'Problem Solving',
      labelBn: 'সমস্যা সমাধান',
      icon: 'psychology',
    },
    {
      id: 'ai',
      href: localePath(locale, 'ai'),
      labelEn: 'AI & Framework',
      labelBn: 'AI ও Framework',
      icon: 'auto_awesome',
    },
    {
      id: 'companies-top',
      href: localePath(locale, 'companies'),
      labelEn: 'Companies',
      labelBn: 'কোম্পানি',
      icon: 'business',
    },
  ];
}

/** Flat links for compact mobile primary list. */
export function getMobilePrimaryLinks(locale: Locale): NavItem[] {
  return [
    { id: 'tracks', href: localePath(locale, 'tracks'), labelEn: 'Learning tracks', labelBn: 'লার্নিং ট্র্যাক', icon: 'school' },
    { id: 'careers', href: localePath(locale, 'careers'), labelEn: 'Careers', labelBn: 'ক্যারিয়ার', icon: 'work' },
    { id: 'projects', href: localePath(locale, 'projects'), labelEn: 'Projects', labelBn: 'প্রজেক্ট', icon: 'code' },
    { id: 'interviews', href: localePath(locale, 'interviews'), labelEn: 'Interview', labelBn: 'ইন্টারভিউ', icon: 'quiz' },
    { id: 'problem-solving', href: localePath(locale, 'problem-solving'), labelEn: 'Problem Solving', labelBn: 'সমস্যা সমাধান', icon: 'psychology' },
    { id: 'ai', href: localePath(locale, 'ai'), labelEn: 'AI & Framework', labelBn: 'AI ও Framework', icon: 'auto_awesome' },
    { id: 'history', href: localePath(locale, 'history'), labelEn: 'Computing History', labelBn: 'কম্পিউটিং ইতিহাস', icon: 'history' },
    { id: 'companies', href: localePath(locale, 'companies'), labelEn: 'Companies', labelBn: 'কোম্পানি', icon: 'business' },
    { id: 'job-market', href: localePath(locale, 'job-market'), labelEn: 'Bangladesh Tech Market', labelBn: 'বাংলাদেশ টেক মার্কেট', icon: 'map' },
    { id: 'search', href: localePath(locale, 'search'), labelEn: 'Search', labelBn: 'সার্চ', icon: 'search' },
    { id: 'my-learning', href: localePath(locale, 'my-learning'), labelEn: 'My Learning', labelBn: 'আমার শেখা', icon: 'progress_activity' },
  ];
}

export type FooterColumn = {
  id: string;
  titleEn: string;
  titleBn: string;
  links: NavItem[];
};

export function getFooterColumns(locale: Locale): FooterColumn[] {
  return [
    {
      id: 'learn',
      titleEn: 'Learn',
      titleBn: 'শেখা',
      links: [
        { id: 'f-tracks', href: localePath(locale, 'tracks'), labelEn: 'All tracks', labelBn: 'সব ট্র্যাক' },
        ...tracks.map((track) => ({
          id: `f-${track.id}`,
          href: localePath(locale, `tracks/${track.slug}`),
          labelEn: track.title,
          labelBn: track.titleBn,
        })),
      ],
    },
    {
      id: 'career',
      titleEn: 'Career',
      titleBn: 'ক্যারিয়ার',
      links: [
        { id: 'f-careers', href: localePath(locale, 'careers'), labelEn: 'Career Explorer', labelBn: 'ক্যারিয়ার এক্সপ্লোরার' },
        { id: 'f-roadmaps', href: localePath(locale, 'tracks'), labelEn: 'Skill Roadmaps', labelBn: 'স্কিল রোডম্যাপ' },
        { id: 'f-projects', href: localePath(locale, 'projects'), labelEn: 'Projects', labelBn: 'প্রজেক্ট' },
        { id: 'f-interviews', href: localePath(locale, 'interviews'), labelEn: 'Interview Preparation', labelBn: 'ইন্টারভিউ প্রস্তুতি' },
        { id: 'f-problem-solving', href: localePath(locale, 'problem-solving'), labelEn: 'Problem Solving', labelBn: 'সমস্যা সমাধান' },
        { id: 'f-market', href: localePath(locale, 'job-market'), labelEn: 'Bangladesh Tech Market', labelBn: 'বাংলাদেশ টেক মার্কেট' },
        { id: 'f-companies', href: localePath(locale, 'companies'), labelEn: 'Companies', labelBn: 'কোম্পানি' },
      ],
    },
    {
      id: 'platform',
      titleEn: 'Platform',
      titleBn: 'প্ল্যাটফর্ম',
      links: [
        { id: 'f-history', href: localePath(locale, 'history'), labelEn: 'Computing History', labelBn: 'কম্পিউটিং ইতিহাস' },
        { id: 'f-blueprint', href: localePath(locale, 'blueprint'), labelEn: 'Engineering Blueprint', labelBn: 'ইঞ্জিনিয়ারিং ব্লুপ্রিন্ট' },
        { id: 'f-my', href: localePath(locale, 'my-learning'), labelEn: 'My Learning', labelBn: 'আমার শেখা' },
        { id: 'f-search', href: localePath(locale, 'search'), labelEn: 'Search', labelBn: 'সার্চ' },
        { id: 'f-method', href: localePath(locale, 'methodology'), labelEn: 'Methodology', labelBn: 'পদ্ধতি' },
        { id: 'f-about', href: localePath(locale, 'about'), labelEn: 'About', labelBn: 'সম্পর্কে' },
      ],
    },
    {
      id: 'community',
      titleEn: 'Community',
      titleBn: 'কমিউনিটি',
      links: [
        { id: 'f-github', href: siteConfig.repoUrl, labelEn: 'GitHub Repository', labelBn: 'GitHub রিপোজিটরি' },
        { id: 'f-contribute', href: localePath(locale, 'contribute'), labelEn: 'Contribute', labelBn: 'অবদান' },
        { id: 'f-contact', href: localePath(locale, 'contact'), labelEn: 'Report / Contact', labelBn: 'রিপোর্ট / যোগাযোগ' },
      ],
    },
    {
      id: 'legal',
      titleEn: 'Legal',
      titleBn: 'আইনি',
      links: [
        { id: 'f-privacy', href: localePath(locale, 'privacy'), labelEn: 'Privacy', labelBn: 'গোপনীয়তা' },
        { id: 'f-terms', href: localePath(locale, 'terms'), labelEn: 'Terms', labelBn: 'শর্তাবলি' },
        { id: 'f-cookies', href: localePath(locale, 'cookies'), labelEn: 'Cookies', labelBn: 'কুকি' },
        { id: 'f-ai', href: localePath(locale, 'ai-disclosure'), labelEn: 'AI Content Disclosure', labelBn: 'AI কন্টেন্ট প্রকাশ' },
        { id: 'f-method-legal', href: localePath(locale, 'methodology'), labelEn: 'Editorial Policy', labelBn: 'সম্পাদনা নীতি' },
      ],
    },
  ];
}

export function trackIcon(trackId: string): string {
  const map: Record<string, string> = {
    foundations: 'school',
    'mobile-flutter': 'phone_android',
    frontend: 'web',
    backend: 'dns',
    fullstack: 'layers',
    devops: 'cloud',
    database: 'database',
    qa: 'fact_check',
    uiux: 'design_services',
    'project-management': 'assignment',
    'ai-framework': 'auto_awesome',
  };
  return map[trackId] ?? 'school';
}

/** All internal path suffixes used by navigation (for validation). */
export function getNavigablePathSuffixes(): string[] {
  return [
    '',
    'tracks',
    'careers',
    'companies',
    'history',
    'blueprint',
    'interviews',
    'problem-solving',
    'projects',
    'search',
    'my-learning',
    'ai',
    'ai/tools',
    'ai/prompt-recipes',
    'ai/decisions',
    'ai/verify',
    'ai-disclosure',
    'job-market',
    'methodology',
    'privacy',
    'terms',
    'cookies',
    'contact',
    'contribute',
    'about',
    ...tracks.map((t) => `tracks/${t.slug}`),
  ];
}
