import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { SectionShell } from "./SectionShell";
import { useSitePrefs } from "@/hooks/use-site-prefs";
import { PAPERS, UI, type CompareRow, type PaperItem } from "@/lib/content";
import { cn } from "@/lib/utils";

/** 索引条：短名 + 会议，点击滚动到对应论文 */
function PaperIndex({ papers }: { papers: PaperItem[] }) {
  const jump = (i: number) => {
    document.getElementById(`paper-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <nav className="reveal grid grid-cols-2 gap-y-6 border-y border-hairline py-7 sm:grid-cols-3 lg:grid-cols-5">
      {papers.map((p, i) => (
        <button
          key={p.short}
          type="button"
          onClick={() => jump(i)}
          className="index-cell tap-press text-left"
        >
          <span className="block text-[17px] font-bold tracking-[-0.02em]">{p.short}</span>
          <span className="mt-1.5 block text-[13px] text-muted-foreground">{p.venue}</span>
        </button>
      ))}
    </nav>
  );
}

/** 把真实数值换算成条长：lower 表示越低越好，取反向填充 */
function fillPct(raw: number, rows: CompareRow[], key: string, direction: "lower" | "higher") {
  const all = rows
    .flatMap((r) => r.metrics.filter((m) => m.key === key).map((m) => m.raw))
    .filter((n) => Number.isFinite(n));
  if (!all.length) return 0;
  const min = Math.min(...all);
  const max = Math.max(...all);
  if (max === min) return 62;
  // 留出 18% 安全余量，最长条不顶满容器
  const ratio = direction === "lower" ? (max - raw) / (max - min) : (raw - min) / (max - min);
  return 22 + Math.min(Math.max(ratio, 0), 1) * 78;
}

/** 分组对比表：一行一个模型配置，主指标驱动条长，次指标同行对齐 */
function CompareTable({ paper }: { paper: PaperItem }) {
  const { t } = useSitePrefs();
  const c = paper.compare!;
  const lowerIsBetter = c.rows[0].direction === "lower";
  const best = c.rows.reduce((a, b) => {
    const am = a.metrics.find((m) => m.key === c.metricKey)?.raw ?? Infinity;
    const bm = b.metrics.find((m) => m.key === c.metricKey)?.raw ?? Infinity;
    return lowerIsBetter ? (bm < am ? b : a) : bm > am ? b : a;
  }, c.rows[0]);

  return (
    <div className="data-panel reveal-right reveal lg:self-start">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="text-[15px] font-bold tracking-[-0.01em]">{t(paper.panelTitle)}</h4>
        <span className="text-[13px] text-muted-foreground">{t(paper.panelNote)}</span>
      </div>

      {/* 参考轴：两端标注取自真实取值区间，不再是假的 0/50/100% */}
      <div className="compare-axis mt-6">
        <div className="flex items-baseline justify-between font-mono text-[11px] tracking-tight text-muted-foreground tabular-nums">
          <span>{c.axis.min}</span>
          <span>{c.axis.max}</span>
        </div>
        <div className="mt-1.5 h-px bg-hairline" />
        <p className="mt-2 text-[12px] text-muted-foreground">{t(c.axis.caption)}</p>
      </div>

      <ul className="mt-7 space-y-6">
        {c.rows.map((row) => {
          const main = row.metrics.find((m) => m.key === c.metricKey);
          const others = row.metrics.filter((m) => m.key !== c.metricKey);
          const isBest = row === best;
          return (
            <li key={row.label} className="compare-row">
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p
                    className={cn(
                      "truncate text-[14px] leading-tight",
                      row.primary ? "font-bold text-accent-blue" : "font-medium",
                    )}
                  >
                    {row.label}
                  </p>
                  {row.note ? (
                    <p className="mt-1 text-[12px] text-muted-foreground">
                      {t(row.note)}
                      {isBest ? <span className="compare-best"> · {t({ zh: "最优", en: "best" })}</span> : null}
                    </p>
                  ) : null}
                </div>
                <p className="shrink-0 font-display text-[26px] leading-none font-bold tracking-[-0.035em] tabular-nums sm:text-[30px]">
                  {main?.value ?? "—"}
                  {main?.unit ? <span className="text-[14px] font-medium">{main.unit}</span> : null}
                </p>
              </div>

              <div className="mt-2.5 flex items-center gap-3">
                <div className="compare-track h-2.5 grow overflow-hidden rounded-full bg-accent">
                  <div
                    className={cn("h-full rounded-full animate-bar", row.primary ? "bg-ios-blue" : "bg-ios-gray/55")}
                    style={{ width: `${fillPct(main?.raw ?? 0, c.rows, c.metricKey, row.direction)}%` }}
                  />
                </div>
                {others.length ? (
                  <ul className="flex shrink-0 gap-4 text-[12px] text-muted-foreground tabular-nums">
                    {others.map((m) => (
                      <li key={m.key}>
                        <span className="opacity-70">{m.key}</span>{" "}
                        <span className="font-semibold text-foreground">{m.value}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      {/* 改进幅度强调块：主数字 + 次要指标，替代原来孤立的大数字 */}
      <div className="mt-8 border-t border-hairline pt-6">
        <div className="flex items-end gap-4">
          <p className="gain-figure font-display text-[44px] leading-[0.9] font-bold tracking-[-0.04em] sm:text-[46px]">
            {c.gain.value}
            <span className="text-[22px]">%</span>
          </p>
          <div className="pb-1">
            <p className="text-[15px] font-medium">{t(c.gain.label)}</p>
            <p className="mt-1 text-[13px] leading-[1.55] text-muted-foreground">{t(c.gain.note)}</p>
          </div>
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-4 border-t border-dashed border-hairline pt-5">
          {c.gain.secondary.map((s) => (
            <li key={t(s.label)}>
              <p className="font-display text-[22px] leading-none font-bold tracking-[-0.03em] tabular-nums">
                {s.value}
              </p>
              <p className="mt-1.5 text-[12px] text-muted-foreground">{t(s.label)}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* bigStat 在此形态下降级为脚注：主强调位已由改进幅度占据 */}
      {paper.bars.length ? null : (
        <p className="mt-6 text-[12px] leading-[1.6] text-muted-foreground">
          <span className="font-display font-bold text-foreground tabular-nums">
            {paper.bigStat.value}
            {paper.bigStat.unit}
          </span>{" "}
          · {t(paper.bigStat.label)} · {t(paper.bigStat.note)}
        </p>
      )}
    </div>
  );
}

/** 右侧数据面板：对比条 + 单个大数字 */
function DataPanel({ paper }: { paper: PaperItem }) {
  const { t } = useSitePrefs();
  if (paper.compare) return <CompareTable paper={paper} />;

  return (
    <div className="data-panel reveal-right reveal lg:self-start">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="text-[15px] font-bold tracking-[-0.01em]">{t(paper.panelTitle)}</h4>
        <span className="text-[13px] text-muted-foreground">{t(paper.panelNote)}</span>
      </div>

      <div className="mt-6 flex items-baseline justify-between text-[12px] text-muted-foreground">
        <span>0</span>
        <span>50</span>
        <span>100%</span>
      </div>
      <div className="mt-1 h-px bg-hairline" />

      <dl className="mt-6 space-y-7">
        {paper.bars.map((b) => (
          <div key={b.label}>
            <div className="flex items-end justify-between gap-4">
              <dt className="text-[14px]">{b.label}</dt>
              <dd className="flex items-baseline gap-0.5">
                <span className="font-display text-[38px] leading-none font-bold tracking-[-0.035em] tabular-nums">
                  {b.value}
                </span>
                {b.unit ? <span className="text-[15px] text-muted-foreground">{b.unit}</span> : null}
              </dd>
            </div>
            <div className="mt-2.5 h-7 overflow-hidden rounded-md bg-accent">
              <div
                className={cn("h-full rounded-md animate-bar", b.primary ? "bg-ios-blue" : "bg-ios-gray/55")}
                style={{ width: `${Math.min(b.pct, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-8 border-t border-hairline pt-6">
        <div className="flex items-end gap-4">
          <p className="font-display text-[46px] leading-[0.9] font-bold tracking-[-0.04em] tabular-nums">
            {paper.bigStat.value}
            {paper.bigStat.unit ? (
              <span className="text-[24px]">{paper.bigStat.unit}</span>
            ) : null}
          </p>
          <div className="pb-1">
            <p className="text-[15px] font-medium">{t(paper.bigStat.label)}</p>
            <p className="mt-1 text-[13px] text-muted-foreground">{t(paper.bigStat.note)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaperEntry({ paper, index }: { paper: PaperItem; index: number }) {
  const { t } = useSitePrefs();
  const [open, setOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);

  return (
    <article id={`paper-${index}`} className="scroll-mt-28 border-b border-hairline py-14 first:pt-0 sm:py-16">
      {/* 会议 + track 徽章 + 角色 + 时间 */}
      <header className="reveal flex flex-wrap items-center gap-x-5 gap-y-3">
        <h3 className="font-display text-[22px] font-bold tracking-[-0.025em] sm:text-[26px]">
          {paper.venue}
        </h3>
        <span className="rounded-lg bg-accent-blue-soft px-3 py-1.5 text-[13px] font-medium text-accent-blue">
          {t(paper.track)}
        </span>
        <span className="text-[14px] text-muted-foreground">{t(paper.role)}</span>
        <span className="ml-auto font-mono text-[13px] tracking-tight text-muted-foreground tabular-nums">
          {paper.period}
        </span>
      </header>

      <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,40%)] lg:gap-14">
        {/* 左栏：短名、大标题、问题与方法 */}
        <div>
          <p className="reveal text-[14px] font-bold tracking-[0.02em] text-accent-blue">{paper.short}</p>
          <h4 className="item-headline reveal mt-3 text-balance" data-reveal-delay="60">
            {t(paper.title)}
          </h4>
          <p className="reveal mt-5 text-[17px] leading-relaxed text-muted-foreground" data-reveal-delay="120">
            {t(paper.oneLine)}
          </p>

          <div className="reveal mt-9 space-y-7" data-reveal-delay="160">
            <div>
              <h5 className="text-[15px] font-bold">{t({ zh: "问题", en: "The question" })}</h5>
              <p className="mt-2 max-w-prose text-[16px] leading-[1.65]">{t(paper.question)}</p>
            </div>
            <div>
              <h5 className="text-[15px] font-bold">{t({ zh: "方法", en: "The approach" })}</h5>
              <p className="mt-2 max-w-prose text-[16px] leading-[1.65]">{t(paper.approach)}</p>
            </div>
          </div>

          <ul className="reveal mt-9 flex flex-wrap gap-x-7 gap-y-2 text-[13px] text-muted-foreground">
            {paper.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <DataPanel paper={paper} />
      </div>

      {/* 展开 / 收起 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="tap-press mt-10 flex w-full items-center justify-between gap-4 border-t border-hairline pt-6 text-left"
      >
        <span className="text-[15px] font-bold text-accent-blue">
          {t(open ? UI.collapse : UI.expand)}
        </span>
        <span className="toggle-disc shrink-0" aria-hidden>
          {open ? <Minus size={15} strokeWidth={2.2} /> : <Plus size={15} strokeWidth={2.2} />}
        </span>
      </button>

      {open ? (
        <div className="mt-8 grid gap-x-14 gap-y-9 sm:grid-cols-2">
          {paper.details.map((d) => (
            <div key={t(d.heading)}>
              <h5 className="text-[15px] font-bold">{t(d.heading)}</h5>
              <p className="mt-2.5 text-[15px] leading-[1.7] text-muted-foreground">{t(d.body)}</p>
            </div>
          ))}
        </div>
      ) : null}

      {/* 项目说明：与「研究细节」同级的可展开区块 */}
      {paper.project ? (
        <>
          <button
            type="button"
            onClick={() => setProjectOpen((v) => !v)}
            aria-expanded={projectOpen}
            className="tap-press mt-10 flex w-full items-center justify-between gap-4 border-t border-hairline pt-6 text-left"
          >
            <span className="text-[15px] font-bold text-accent-blue">
              {t({ zh: "项目说明", en: "The project" })}
              <span className="ml-3 text-[13px] font-normal text-muted-foreground">
                {t(paper.project.name)}
              </span>
            </span>
            <span className="toggle-disc shrink-0" aria-hidden>
              {projectOpen ? <Minus size={15} strokeWidth={2.2} /> : <Plus size={15} strokeWidth={2.2} />}
            </span>
          </button>

          {projectOpen ? (
            <div className="mt-8 grid gap-x-14 gap-y-9 sm:grid-cols-2">
              <div>
                <h5 className="text-[15px] font-bold">{t({ zh: "项目概述", en: "Overview" })}</h5>
                <p className="mt-2.5 text-[15px] leading-[1.7] text-muted-foreground">
                  {t(paper.project.summary)}
                </p>
              </div>
              <div>
                <h5 className="text-[15px] font-bold">{t({ zh: "完整说明", en: "Full description" })}</h5>
                <p className="mt-2.5 text-[15px] leading-[1.7] text-muted-foreground">
                  {t(paper.project.detail)}
                </p>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </article>
  );
}

export function PapersSection() {
  const { t } = useSitePrefs();
  return (
    <SectionShell
      id="papers"
      eyebrow={{ zh: "精选研究", en: "Selected research" }}
      title={{ zh: "推进智能体", en: "Advancing intelligent agents." }}
      lede={{
        zh: "从方法与系统到应用，研究 LLM 智能体如何学习、协作并通过评测。",
        en: "Training and evaluating LLM agents, from methods and systems to applications.",
      }}
      stats={[
        { value: "3", label: { zh: "会议论文录用", en: "Accepted papers" } },
        { value: "3", label: { zh: "共同第一作者", en: "Co-first authorships" } },
      ]}
    >
      <PaperIndex papers={PAPERS} />
      <div className="mt-2">
        {PAPERS.map((p, i) => (
          <PaperEntry key={p.short} paper={p} index={i} />
        ))}
      </div>
      <p className="sr-only">{t(UI.footerNote)}</p>
    </SectionShell>
  );
}
