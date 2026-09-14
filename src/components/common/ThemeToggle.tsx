import { useEffect, useId, useState } from 'react';
import {
  applyTheme,
  readThemePreference,
  writeThemePreference,
  type ThemePreference,
} from '../../utils/theme';

interface Props {
  labels: {
    light: string;
    dark: string;
    system: string;
    label: string;
  };
}

export default function ThemeToggle({ labels }: Props) {
  const id = useId();
  const [preference, setPreference] = useState<ThemePreference>('system');

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

  const onSelect = (value: ThemePreference) => {
    setPreference(value);
    writeThemePreference(value);
  };

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {labels.label}
      </label>
      <select
        id={id}
        value={preference}
        onChange={(e) => onSelect(e.target.value as ThemePreference)}
        className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-2 py-1.5 text-sm text-[var(--color-ink)]"
        aria-label={labels.label}
      >
        <option value="light">{labels.light}</option>
        <option value="dark">{labels.dark}</option>
        <option value="system">{labels.system}</option>
      </select>
    </div>
  );
}
