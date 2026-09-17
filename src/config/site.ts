/**
 * Central site configuration for TechStackBD.
 * Only include URLs that exist; leave optional fields undefined rather than inventing links.
 */
export const siteConfig = {
  siteName: 'TechStackBD',
  siteNameBn: 'TechStackBD',
  tagline:
    'Bangladesh-focused technology learning and career roadmap platform—skills, projects, interviews, and AI-assisted engineering.',
  taglineBn:
    'বাংলাদেশ-কেন্দ্রিক প্রযুক্তি শেখা ও ক্যারিয়ার রোডম্যাপ প্ল্যাটফর্ম—স্কিল, প্রজেক্ট, ইন্টারভিউ এবং AI-assisted engineering।',
  shortDescription:
    'TechStackBD is an open-source learning and career platform helping technology learners understand what to learn, why it matters, what to build, and how to prepare for real engineering careers.',
  shortDescriptionBn:
    'TechStackBD একটি ওপেন-সোর্স লার্নিং ও ক্যারিয়ার প্ল্যাটফর্ম—কী শিখবেন, কেন গুরুত্বপূর্ণ, কী বানাবেন এবং কীভাবে আসল ইঞ্জিনিয়ারিং ক্যারিয়ারের জন্য প্রস্তুতি নেবেন।',
  defaultLocale: 'en' as const,
  supportedLocales: ['en', 'bn'] as const,
  repoUrl: 'https://github.com/emondd4/devturningpoint',
  /** Optional — omit from UI when undefined */
  contactUrl: undefined as string | undefined,
  socialLinks: [] as { label: string; href: string }[],
  brand: {
    icon: '/images/01a_techstackbd_transparent_logo.png',
    wordmark: '/images/01b_techstackbd_transparent_logo_with_text.png',
    loading: '/images/02_techstackbd_loading_logo.gif',
    heroes: [
      '/images/04_hero_01_platform_ecosystem_hd.png',
      '/images/05_hero_02_technology_evolution_hd.png',
      '/images/06_hero_03_learning_roadmap_hd.png',
      '/images/07_hero_04_projects_interviews_hd.png',
      '/images/08_hero_05_ai_framework_hd.png',
    ],
    features: {
      careers: '/images/09_feature_01_career_path_explorer_hd.png',
      skillTree: '/images/10_feature_02_skill_tree_prerequisites_hd.png',
      projects: '/images/11_feature_03_project_based_learning_hd.png',
      interviews: '/images/12_feature_04_interview_preparation_hd.png',
      aiWorkflows: '/images/13_feature_05_ai_assisted_workflows_hd.png',
      bangladesh: '/images/14_feature_06_bangladesh_tech_industry_hd.png',
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
