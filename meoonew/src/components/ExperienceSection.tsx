import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { COMPETITION_AWARDS, EDUCATION, RESEARCH, type AwardGroup, type EducationItem, type TimelineItem } from "@/lib/content";
import { useSitePrefs } from "@/hooks/use-site-prefs";
import { SectionShell } from "./SectionShell";

/** 教育背景：两所在读院校合并在同一条目内，左栏并列、右栏统一要点 */
function EducationRow({ item }: { item: EducationItem }) {
  const { t } = useSitePrefs();
  return (
    <li className="rule-row reveal py-9 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,32%)_minmax(0,1fr)] lg:gap-12">
        <div className="space-y-6">
          {item.schools.map((s) => (
            <div key={s.period}>
              <h3 className="text-[17px] leading-snug font-bold tracking-[-0.02em]">{t(s.org)}</h3>
              <p className="mt-1.5 text-[15px] text-accent-blue">{t(s.role)}</p>
              <p className="mt-3 font-mono text-[13px] tracking-tight text-muted-foreground tabular-nums">
                {s.period} · {t(s.place)}
              </p>
            </div>
          ))}
        </div>

        <ul className="space-y-3">
          {item.bullets.map((b) => (
            <li key={b.en} className="flex gap-3 text-[16px] leading-[1.65] text-foreground/85">
              <span className="mt-[11px] h-px w-4 shrink-0 bg-accent-blue" />
              {t(b)}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

/** 编辑排版的行式条目：左栏机构与角色，右栏职责要点 */
function TimelineRow({ item, delay }: { item: TimelineItem; delay: number }) {
  const { t } = useSitePrefs();
  return (
    <li className="rule-row reveal py-9 sm:py-10" data-reveal-delay={String(delay)}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,32%)_minmax(0,1fr)] lg:gap-12">
        <div>
          <h3 className="text-[17px] leading-snug font-bold tracking-[-0.02em]">{t(item.org)}</h3>
          <p className="mt-1.5 text-[15px] text-accent-blue">{t(item.role)}</p>
          <p className="mt-3 font-mono text-[13px] tracking-tight text-muted-foreground tabular-nums">
            {item.period}
            {item.place ? ` · ${t(item.place)}` : ""}
          </p>
          {item.tags?.length ? (
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-muted-foreground">
              {item.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <ul className="space-y-3">
          {item.bullets.map((b) => (
            <li key={b.en} className="flex gap-3 text-[16px] leading-[1.65] text-foreground/85">
              <span className="mt-[11px] h-px w-4 shrink-0 bg-accent-blue" />
              {t(b)}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function GroupLabel({ children }: { children: string }) {
  return (
    <h2 className="reveal mb-1 border-b border-hairline pb-3 text-[13px] font-bold tracking-[0.08em] text-muted-foreground uppercase">
      {children}
    </h2>
  );
}

/** 竞赛获奖：按级别折叠为独立条目，点击展开后逐条列出 */
function AwardGroupItem({ group, first }: { group: AwardGroup; first: boolean }) {
  const { t } = useSitePrefs();
  const [open, setOpen] = useState(false);

  return (
    <div className="reveal">
      {!first && <div className="border-t border-hairline" aria-hidden />}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="tap-press flex w-full items-center justify-between gap-4 py-9 text-left sm:py-10"
      >
        <span className="text-[17px] leading-snug font-bold tracking-[-0.02em]">
          ❖{" "}
          {t(group.label)}
          <span className="ml-3 text-[14px] font-normal text-muted-foreground">
            {t(group.countLabel)}
          </span>
        </span>
        <span className="toggle-disc shrink-0" aria-hidden>
          {open ? <Minus size={15} strokeWidth={2.2} /> : <Plus size={15} strokeWidth={2.2} />}
        </span>
      </button>

      {open ? (
        <ul className="mt-2 mb-6 space-y-4">
          {group.items.map((a) => (
            <li key={a.en} className="flex gap-3 text-[16px] leading-[1.65] text-foreground/85">
              <span aria-hidden className="mt-[5px] shrink-0 text-[12px] text-accent-gold">
                ❖
              </span>
              {t(a)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ExperienceSection() {
  const { t } = useSitePrefs();

  return (
    <SectionShell
      id="experience"
      eyebrow={{ zh: "教育与科研", en: "Education & Research" }}
      title={{ zh: "从课程到跨学科实践。", en: "From coursework to interdisciplinary practice." }}
      lede={{
        zh: "中美双理工科背景：一门课一个模型地积累，再把方法带进真实的研究与竞赛场景。",
        en: "A dual China–US STEM background — building model by model in class, then carrying those methods into real research and competitions.",
      }}
      stats={[
        { value: "2", label: { zh: "在读学位", en: "Degree programmes" } },
        { value: "10", label: { zh: "实践项目", en: "Practical projects" } },
      ]}
    >
      <GroupLabel>{t({ zh: "教育背景", en: "Education" })}</GroupLabel>
      <ul>
        {EDUCATION.map((item) => (
          <EducationRow key={item.schools[0].period} item={item} />
        ))}
      </ul>

      <div className="mt-16">
        <GroupLabel>{t({ zh: "项目经历", en: "Program Experience" })}</GroupLabel>
        <ul>
          {RESEARCH.map((item, i) => (
            <TimelineRow key={item.period + i} item={item} delay={i * 80} />
          ))}
        </ul>
      </div>

      <div className="mt-16">
        {COMPETITION_AWARDS.map((group, i) => (
          <AwardGroupItem key={group.label.en} group={group} first={i === 0} />
        ))}
      </div>
    </SectionShell>
  );
}
