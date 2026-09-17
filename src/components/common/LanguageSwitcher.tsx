import { useEffect, useId, useRef, useState } from 'react';
import { switchLocalePath, type Locale } from '../../i18n/config';
import { LOCALE_STORAGE_KEY } from '../../utils/theme';
import MaterialIcon from '../ui/MaterialIcon';

interface Props {
  locale: Locale;
  labels: {
    en: string;
    bn: string;
    label: string;
  };
}

export default function LanguageSwitcher({ locale, labels }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const onSelect = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    window.location.href = switchLocalePath(window.location.pathname, next);
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="btn btn-ghost btn-icon"
        aria-label={labels.label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <MaterialIcon name="language" size={22} />
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-50 mt-1.5 min-w-[9.5rem] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-[var(--shadow-md)]"
        >
          {(
            [
              { id: 'en' as const, label: labels.en },
              { id: 'bn' as const, label: labels.bn },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="menuitemradio"
              aria-checked={locale === opt.id}
              className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
              onClick={() => onSelect(opt.id)}
            >
              <span>{opt.label}</span>
              {locale === opt.id && <MaterialIcon name="check" size={18} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
