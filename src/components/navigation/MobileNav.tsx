import { useEffect, useId, useRef, useState } from 'react';
import type { Locale } from '../../i18n/config';
import { getMobilePrimaryLinks, labelFor } from '../../data/navigation';
import MaterialIcon from '../ui/MaterialIcon';

interface Props {
  locale: Locale;
  siteName: string;
  logoSrc: string;
  menuLabel: string;
  closeLabel: string;
}

export default function MobileNav({
  locale,
  siteName,
  logoSrc,
  menuLabel,
  closeLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const links = getMobilePrimaryLinks(locale);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) closeRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        className="btn btn-ghost btn-icon"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label={menuLabel}
        onClick={() => setOpen(true)}
      >
        <MaterialIcon name="menu" size={24} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-primary-950)_45%,transparent)]"
            aria-label={closeLabel}
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute right-0 top-0 flex h-full w-[min(22rem,92vw)] flex-col bg-[var(--color-surface)] shadow-[var(--shadow-lg)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
              <div className="flex items-center gap-2">
                <img src={logoSrc} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
                <p id={titleId} className="font-semibold text-[var(--color-text)]">
                  {siteName}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="btn btn-ghost btn-icon"
                aria-label={closeLabel}
                onClick={() => setOpen(false)}
              >
                <MaterialIcon name="close" size={22} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Mobile">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="nav-link w-full justify-start py-3 text-base"
                  onClick={() => setOpen(false)}
                >
                  {link.icon && <MaterialIcon name={link.icon} size={20} />}
                  <span>{labelFor(link, locale)}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
