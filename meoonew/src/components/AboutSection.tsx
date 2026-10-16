import { SectionShell } from "./SectionShell";
import { useSitePrefs } from "@/hooks/use-site-prefs";
import { ABOUT, HERO } from "@/lib/content";

export function AboutSection() {
  const { t } = useSitePrefs();

  return (
    <SectionShell
      id="about"
      eyebrow={{ zh: "关于我", en: "About" }}
      title={{ zh: "今日之探索，明日之智能。", en: "Today's exploration, tomorrow's intelligence." }}
      lede={ABOUT.paragraph}
      stats={[
        { value: "3", label: { zh: "论文录用", en: "Papers accepted" } },
        { value: "3", label: { zh: "共同一作", en: "Co-first authorships" } },
        { value: "5", label: { zh: "省级以上荣誉", en: "Provincial+ honours" } },
      ]}
    >
      {/* 三个要点：细线行式，不用卡片 */}
      <div className="border-t border-hairline">
        {ABOUT.points.map((p, i) => (
          <div
            key={t(p.title)}
            className="rule-row reveal grid gap-3 py-8 sm:grid-cols-[auto_minmax(0,10rem)_minmax(0,1fr)] sm:items-baseline sm:gap-7"
            data-reveal-delay={i * 80}
          >
            <span className="font-mono text-[12px] text-muted-foreground tabular-nums">
              0{i + 1}
            </span>
            <h3 className="text-[17px] font-bold tracking-[-0.02em]">{t(p.title)}</h3>
            <p className="max-w-prose text-[16px] leading-[1.65] text-muted-foreground">
              {t(p.desc)}
            </p>
          </div>
        ))}
      </div>

      {/* 方向标签：与首屏一致的点状分隔 */}
      <ul className="reveal mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-muted-foreground">
        {HERO.focus.map((f, i) => (
          <li key={t(f)} className="flex items-center gap-4">
            {i > 0 ? <span className="h-1 w-1 rounded-full bg-accent-blue" aria-hidden /> : null}
            {t(f)}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
