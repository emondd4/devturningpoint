import { useEffect } from 'react';
import { LOCALE_STORAGE_KEY } from '../../utils/theme';
import { switchLocalePath, type Locale } from '../../i18n/config';

interface Props {
  locale: Locale;
  labels: {
    en: string;
    bn: string;
    label: string;
  };
}

export default function LanguageSwitcher({ locale, labels }: Props) {
  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const onChange = (next: Locale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    window.location.href = switchLocalePath(window.location.pathname, next);
  };

  return (
    <div>
      <label htmlFor="language-switcher" className="sr-only">
        {labels.label}
      </label>
      <select
        id="language-switcher"
        value={locale}
        onChange={(e) => onChange(e.target.value as Locale)}
        className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-2 py-1.5 text-sm text-[var(--color-ink)]"
        aria-label={labels.label}
      >
        <option value="en">{labels.en}</option>
        <option value="bn">{labels.bn}</option>
      </select>
    </div>
  );
}
