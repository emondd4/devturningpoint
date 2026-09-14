import { useEffect, useId, useState } from 'react';
import type { Locale } from '../../i18n/config';

interface LinkItem {
  href: string;
  label: string;
}

interface Props {
  locale: Locale;
  siteName: string;
  links: LinkItem[];
  menuLabel: string;
  closeLabel: string;
}

export default function MobileNav({ siteName, links, menuLabel, closeLabel }: Props) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
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
    <div className="lg:hidden">
      <button
        type="button"
        className="btn btn-ghost px-2 py-1.5"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen(true)}
      >
        {menuLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label={closeLabel}
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute right-0 top-0 flex h-full w-[min(20rem,90vw)] flex-col bg-[var(--color-surface-1)] shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
              <p id={titleId} className="font-semibold text-[var(--color-ink)]">
                {siteName}
              </p>
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
                {closeLabel}
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-3" aria-label="Mobile">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-[var(--radius-md)] px-3 py-2.5 text-[var(--color-ink)] no-underline hover:bg-[var(--color-surface-2)]"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
