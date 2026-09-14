export const locales = ['en', 'bn'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function localePath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+/, '').replace(/\/+$/, '');
  return withBase(clean ? `/${locale}/${clean}/` : `/${locale}/`);
}

export function switchLocalePath(currentPath: string, nextLocale: Locale): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  let path = currentPath;
  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || '/';
  }
  const parts = path.split('/').filter(Boolean);
  if (parts.length && isLocale(parts[0]!)) {
    parts[0] = nextLocale;
  } else {
    parts.unshift(nextLocale);
  }
  return withBase(`/${parts.join('/')}/`);
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'bn' : 'en';
}
