import type { Locale } from './config';

const en = {
  siteName: 'TechStackBD',
  tagline: 'Bangladesh-focused technology learning and career roadmaps',
  skipToContent: 'Skip to content',
  nav: {
    learn: 'Learn',
    careers: 'Careers',
    roadmaps: 'Roadmaps',
    companies: 'Companies',
    history: 'History',
    interviews: 'Interview',
    projects: 'Projects',
    search: 'Search',
    myLearning: 'My Learning',
    about: 'About',
    contribute: 'Contribute',
  },
  actions: {
    exploreCareers: 'Explore Careers',
    findPath: 'Find My Learning Path',
    exploreComputing: 'Explore Computer Engineering',
    continueLearning: 'Continue',
    viewRoadmap: 'View roadmap',
    restart: 'Restart',
    markComplete: 'Mark complete',
    editOnGitHub: 'Edit this page on GitHub',
    exportProgress: 'Export progress',
    importProgress: 'Import progress',
  },
  theme: {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    label: 'Theme',
  },
  language: {
    label: 'Language',
    en: 'English',
    bn: 'Bangla',
  },
  progress: {
    localOnly: 'Progress is stored in this browser.',
    continueTitle: 'Continue where you left off?',
    noProgress: 'No learning path yet. Take a track assessment to create one.',
    restartConfirm: 'Restart this track? Completed topics for this track will be cleared.',
  },
  translation: {
    unavailableTitle: 'Bangla translation unavailable',
    unavailableBody:
      'This page is not translated yet. You can read the English version or help translate it on GitHub.',
    readEnglish: 'Read in English',
    helpTranslate: 'Help translate',
  },
  search: {
    title: 'Search',
    placeholder: 'Search topics, careers, companies…',
    noResults: 'No results found. Try a different keyword or browse tracks.',
    loading: 'Searching…',
  },
  footer: {
    methodology: 'Editorial methodology',
    privacy: 'Privacy',
    terms: 'Terms',
    cookies: 'Cookies',
    aiDisclosure: 'AI-assisted content',
    contact: 'Contact',
    openSource: 'Open source on GitHub',
  },
  difficulty: {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  },
  lastVerified: 'Last technically verified',
  readingTime: 'min read',
  prerequisites: 'Prerequisites',
  related: 'Related topics',
  sources: 'Sources',
  notFound: {
    title: 'Looks like this path isn\'t on the roadmap.',
    body: 'That URL does not match any content. Try home, search, or learning tracks.',
  },
} as const;

const bn = {
  siteName: 'TechStackBD',
  tagline: 'বাংলাদেশ-কেন্দ্রিক প্রযুক্তি শেখা ও ক্যারিয়ার রোডম্যাপ',
  skipToContent: 'সরাসরি কন্টেন্টে যান',
  nav: {
    learn: 'শেখা',
    careers: 'ক্যারিয়ার',
    roadmaps: 'রোডম্যাপ',
    companies: 'কোম্পানি',
    history: 'ইতিহাস',
    interviews: 'ইন্টারভিউ',
    projects: 'প্রজেক্ট',
    search: 'সার্চ',
    myLearning: 'আমার শেখা',
    about: 'সম্পর্কে',
    contribute: 'অবদান',
  },
  actions: {
    exploreCareers: 'ক্যারিয়ার দেখুন',
    findPath: 'আমার লার্নিং পাথ খুঁজুন',
    exploreComputing: 'কম্পিউটার ইঞ্জিনিয়ারিং বুঝুন',
    continueLearning: 'চালিয়ে যান',
    viewRoadmap: 'রোডম্যাপ দেখুন',
    restart: 'আবার শুরু',
    markComplete: 'সম্পন্ন হয়েছে',
    editOnGitHub: 'GitHub-এ এই পেজ সম্পাদনা করুন',
    exportProgress: 'প্রগ্রেস এক্সপোর্ট',
    importProgress: 'প্রগ্রেস ইমপোর্ট',
  },
  theme: {
    light: 'লাইট',
    dark: 'ডার্ক',
    system: 'সিস্টেম',
    label: 'থিম',
  },
  language: {
    label: 'ভাষা',
    en: 'English',
    bn: 'বাংলা',
  },
  progress: {
    localOnly: 'প্রগ্রেস এই ব্রাউজারে সংরক্ষিত থাকে।',
    continueTitle: 'যেখানে থেমেছিলেন সেখান থেকে চালিয়ে যাবেন?',
    noProgress: 'এখনো কোনো লার্নিং পাথ নেই। একটি ট্র্যাক assessment দিয়ে শুরু করুন।',
    restartConfirm: 'এই ট্র্যাক আবার শুরু করবেন? এই ট্র্যাকের সম্পন্ন টপিক মুছে যাবে।',
  },
  translation: {
    unavailableTitle: 'বাংলা অনুবাদ এখনো নেই',
    unavailableBody:
      'এই পেজের বাংলা অনুবাদ এখনো তৈরি হয়নি। ইংরেজি ভার্সন পড়তে পারেন বা GitHub-এ অনুবাদে সাহায্য করতে পারেন।',
    readEnglish: 'ইংরেজিতে পড়ুন',
    helpTranslate: 'অনুবাদে সাহায্য করুন',
  },
  search: {
    title: 'সার্চ',
    placeholder: 'টপিক, ক্যারিয়ার, কোম্পানি খুঁজুন…',
    noResults: 'কোনো ফলাফল পাওয়া যায়নি। অন্য কীওয়ার্ড চেষ্টা করুন বা ট্র্যাক ব্রাউজ করুন।',
    loading: 'খোঁজা হচ্ছে…',
  },
  footer: {
    methodology: 'সম্পাদনা পদ্ধতি',
    privacy: 'গোপনীয়তা',
    terms: 'শর্তাবলি',
    cookies: 'কুকি',
    aiDisclosure: 'AI-সহায়ক কন্টেন্ট',
    contact: 'যোগাযোগ',
    openSource: 'GitHub-এ ওপেন সোর্স',
  },
  difficulty: {
    beginner: 'শুরুর ধাপ',
    intermediate: 'মধ্যম',
    advanced: 'উন্নত',
  },
  lastVerified: 'শেষ প্রযুক্তিগত যাচাই',
  readingTime: 'মিনিট পড়া',
  prerequisites: 'পূর্বশর্ত',
  related: 'সম্পর্কিত টপিক',
  sources: 'সূত্র',
  notFound: {
    title: 'মনে হচ্ছে এই পথ রোডম্যাপে নেই।',
    body: 'এই URL-এর সাথে কোনো কন্টেন্ট মিলছে না। হোম, সার্চ বা লার্নিং ট্র্যাক চেষ্টা করুন।',
  },
} as const;

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  bn: bn as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
