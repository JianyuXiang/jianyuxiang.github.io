import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Bilingual } from "@/lib/content";
import { useSitePrefs } from "@/hooks/use-site-prefs";

interface SectionStat {
  value: string;
  label: Bilingual;
}

interface SectionShellProps {
  id: string;
  /** 眉标，如 Selected research */
  eyebrow?: Bilingual;
  /** 左栏巨型大标题 */
  title: Bilingual;
  /** 右栏章节描述 */
  lede?: Bilingual;
  /** 右栏统计数字组 */
  stats?: SectionStat[];
  children: ReactNode;
  className?: string;
}

/**
 * 编辑排版式章节外壳（对齐参考图研究成果版式）：
 * 左栏眉标 + 巨型大标题，右栏描述与统计；下方为细线分隔的内容区。
 */
export function SectionShell({
  id,
  eyebrow,
  title,
  lede,
  stats,
  children,
  className,
}: SectionShellProps) {
  const { t } = useSitePrefs();

  return (
    <section id={id} className={cn("scroll-mt-24 border-t border-hairline", className)}>
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <header className="reveal grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,42%)] lg:gap-16">
          <div>
            {eyebrow ? <p className="section-eyebrow mb-5">{t(eyebrow)}</p> : null}
            <h2 className="section-title text-balance">{t(title)}</h2>
          </div>
          {(lede || stats?.length) && (
            <div className="lg:pt-10">
              {lede ? <p className="section-lede text-balance">{t(lede)}</p> : null}
              {stats?.length ? (
                <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
                  {stats.map((s) => (
                    <div key={s.value + t(s.label)} className="flex items-baseline gap-2.5">
                      <dt className="font-display text-[34px] leading-none font-bold tracking-[-0.03em]">
                        {s.value}
                      </dt>
                      <dd className="max-w-[9rem] text-[14px] leading-snug text-muted-foreground">
                        {t(s.label)}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          )}
        </header>

        <div className="mt-14 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}
