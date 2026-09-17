import { useEffect, useId, useRef, useState } from 'react';
import {
  applyTheme,
  readThemePreference,
  writeThemePreference,
  type ThemePreference,
} from '../../utils/theme';
import MaterialIcon from '../ui/MaterialIcon';

interface Props {
  labels: {
    light: string;
    dark: string;
    system: string;
    label: string;
  };
}

const OPTIONS: { id: ThemePreference; icon: string; labelKey: keyof Props['labels'] }[] = [
  { id: 'light', icon: 'light_mode', labelKey: 'light' },
  { id: 'dark', icon: 'dark_mode', labelKey: 'dark' },
  { id: 'system', icon: 'contrast', labelKey: 'system' },
];

export default function ThemeToggle({ labels }: Props) {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    const current = readThemePreference();
    setPreference(current);
    applyTheme(current);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (readThemePreference() === 'system') applyTheme('system');
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

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

  const onSelect = (value: ThemePreference) => {
    setPreference(value);
    writeThemePreference(value);
    setOpen(false);
  };

  const triggerIcon =
    preference === 'dark' ? 'dark_mode' : preference === 'light' ? 'light_mode' : 'contrast';

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
        <MaterialIcon name={triggerIcon} size={22} />
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-50 mt-1.5 min-w-[10.5rem] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-[var(--shadow-md)]"
        >
          {OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="menuitemradio"
              aria-checked={preference === opt.id}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
              onClick={() => onSelect(opt.id)}
            >
              <MaterialIcon name={opt.icon} size={18} />
              <span className="flex-1">{labels[opt.labelKey]}</span>
              {preference === opt.id && <MaterialIcon name="check" size={18} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
