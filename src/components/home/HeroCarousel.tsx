import { useCallback, useEffect, useId, useRef, useState } from 'react';
import MaterialIcon from '../ui/MaterialIcon';

export type HeroSlide = {
  id: string;
  imageSrc: string;
  heading: string;
  supporting: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
};

interface Props {
  slides: HeroSlide[];
  previousLabel: string;
  nextLabel: string;
  pauseLabel: string;
  playLabel: string;
}

const INTERVAL_MS = 7000;

export default function HeroCarousel({
  slides,
  previousLabel,
  nextLabel,
  pauseLabel,
  playLabel,
}: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const regionId = useId();
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const go = useCallback(
    (next: number) => {
      setIndex(((next % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, slides.length]);

  const slide = slides[index]!;

  return (
    <section
      className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface)]"
      aria-roledescription="carousel"
      aria-label="TechStackBD highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        const end = e.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (start == null || end == null) return;
        const delta = end - start;
        if (Math.abs(delta) < 40) return;
        go(index + (delta < 0 ? 1 : -1));
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-2xl lg:text-left">
          <p className="section-eyebrow">TechStackBD</p>
          <div id={regionId} aria-live="polite" aria-atomic="true">
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-h1)] font-semibold leading-tight text-[var(--color-text)]">
              {slide.heading}
            </h1>
            <p className="mt-4 text-[length:var(--font-size-body-lg)] text-[var(--color-text-secondary)]">
              {slide.supporting}
            </p>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
            <a className="btn btn-primary btn-lg" href={slide.primaryCta.href}>
              {slide.primaryCta.label}
              <MaterialIcon name="arrow_forward" size={18} />
            </a>
            {slide.secondaryCta && (
              <a className="btn btn-secondary btn-lg" href={slide.secondaryCta.href}>
                {slide.secondaryCta.label}
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[var(--shadow-md)] sm:mt-10">
          <div className="relative w-full">
            {slides.map((s, i) => (
              <img
                key={s.id}
                src={s.imageSrc}
                alt=""
                width={2560}
                height={1000}
                className={
                  i === index
                    ? 'relative block h-auto w-full transition-opacity'
                    : 'pointer-events-none absolute inset-0 h-full w-full object-contain object-center opacity-0 transition-opacity'
                }
                style={{
                  opacity: i === index ? 1 : 0,
                  transitionDuration: reducedMotion ? '0ms' : 'var(--duration-slow)',
                }}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={i === 0 ? 'high' : 'auto'}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              aria-label={previousLabel}
              onClick={() => go(index - 1)}
            >
              <MaterialIcon name="chevron_left" size={24} />
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              aria-label={nextLabel}
              onClick={() => go(index + 1)}
            >
              <MaterialIcon name="chevron_right" size={24} />
            </button>
          </div>
          <div className="flex items-center gap-2" role="tablist" aria-label="Slides">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${i + 1} / ${slides.length}`}
                className="h-2.5 rounded-full transition-all"
                style={{
                  width: i === index ? '1.75rem' : '0.625rem',
                  background: i === index ? 'var(--color-primary)' : 'var(--color-border-strong)',
                }}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          {!reducedMotion && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              aria-pressed={paused}
              onClick={() => setPaused((p) => !p)}
            >
              <MaterialIcon name={paused ? 'play_arrow' : 'pause'} size={18} />
              {paused ? playLabel : pauseLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
