"use client";

import type { ReactElement } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { StatConfig, StatCardProps } from "@/types";

function useCountUp(target: number, durationMs = 1500, startWhenVisible = true): { value: number; ref: React.RefObject<HTMLDivElement> } {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!startWhenVisible) return;

    const node = containerRef.current;
    if (!node) return;

    const onIntersect: IntersectionObserverCallback = (entries, observer) => {
      const [entry] = entries;
      if (entry.isIntersecting && !startedRef.current) {
        startedRef.current = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number): void => {
          const elapsed = now - start;
          const progress = Math.min(1, elapsed / durationMs);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          setValue(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver(onIntersect, { threshold: 0.25 });
    io.observe(node);
    return () => io.disconnect();
  }, [target, durationMs, startWhenVisible]);

  return { value, ref: containerRef as React.RefObject<HTMLDivElement> };
}

function StatCard({ stat }: StatCardProps): ReactElement {
  const { value, ref } = useCountUp(stat.value);

  const display = useMemo(() => `${stat.prefix ?? ""}${value}${stat.suffix ?? ""}`, [value, stat.prefix, stat.suffix]);

  // Determine accent color by label index-like hash
  const accent = useMemo(() => {
    const key = stat.label.toLowerCase();
    if (key.includes("practice") || key.includes("question")) return "var(--color-accent)";
    if (key.includes("professionals") || key.includes("trust")) return "var(--color-mint)";
    return "var(--color-coral)";
  }, [stat.label]);

  return (
    <div ref={ref} className="rounded-xl border bg-primary-dark p-6 card-shadow hover-lift border-default">
      <div className="mb-1 text-3xl sm:text-4xl font-extrabold" style={{ color: accent }}>{display}</div>
      <div className="text-lg font-semibold text-primary mb-1">{stat.label}</div>
      {stat.description && <p className="text-secondary text-sm">{stat.description}</p>}
    </div>
  );
}

export function StatsRow(): ReactElement {
  const STATS: StatConfig[] = [
    { label: "Practice Questions", value: 500, suffix: "+", description: "Across all CRISC domains" },
    { label: "Professionals Trusting", value: 1200, suffix: "+", description: "Join a growing community" },
    { label: "Insights & Dashboards", value: 10, suffix: "+", description: "Identify weak spots quickly" },
  ];

  return (
    <section aria-labelledby="stats-heading" className="mb-16">
      <h2 id="stats-heading" className="sr-only">Key platform stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {STATS.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </div>
    </section>
  );
}
