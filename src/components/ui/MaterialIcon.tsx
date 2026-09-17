interface Props {
  name: string;
  size?: number | string;
  filled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export default function MaterialIcon({
  name,
  size = 20,
  filled = false,
  className = '',
  ariaLabel,
}: Props) {
  const fontSize = typeof size === 'number' ? `${size}px` : size;
  return (
    <span
      className={['material-symbols-rounded', filled ? 'is-filled' : '', className].filter(Boolean).join(' ')}
      style={{ fontSize }}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    >
      {name}
    </span>
  );
}
