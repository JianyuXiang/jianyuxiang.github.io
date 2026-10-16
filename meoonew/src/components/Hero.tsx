import { useState } from "react";
import { ArrowDown, Download } from "lucide-react";
import { AVATAR_URL, HERO, PROFILE, UI } from "@/lib/content";
import { useSitePrefs } from "@/hooks/use-site-prefs";
import { cn } from "@/lib/utils";
import { DotGridLens } from "./DotGridLens";

/** 编辑排版式首屏：元信息行 → 巨型姓名 → 左文右照双栏 → 底部关键词与滚动提示 */
export function Hero() {
  const { t, lang } = useSitePrefs();
  const [imgFailed, setImgFailed] = useState(false);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <header className="relative px-5 pb-10 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pt-24">
      <div className="mx-auto w-full max-w-[1180px]">
        {/* ── 元信息行：每条在读学位一行，样式相同 ─── */}
        <div className="reveal border-b border-hairline pb-5">
          {HERO.metas.map((m, i) => (
            <div
              key={m.period + i}
              className={cn(
                "flex flex-wrap items-start justify-between gap-x-6 gap-y-2",
                i > 0 && "mt-4 border-t border-hairline/60 pt-4"
              )}
            >
              <div>
                <p className="text-[15px] font-semibold tracking-tight">{t(m.org)}</p>
                <p className="mt-1 text-[14px] text-muted-foreground">{t(m.major)}</p>
              </div>
              <p className="font-mono text-[13.5px] text-muted-foreground tabular-nums">
                {m.period}
              </p>
            </div>
          ))}
        </div>

        {/* ── 巨型姓名（波点以鼠标为中心放大） ─────── */}
        <div className="dot-grid relative mt-10 mb-2 overflow-hidden sm:mt-14">
          <DotGridLens />
          <div className="relative flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-1 py-6 [&_.display-name]:max-w-full">
            <h1 className="reveal display-name text-accent-blue">
              {lang === "zh" ? "向建羽." : "Jianyu XIANG."}
            </h1>
          </div>
        </div>

        {/* ── 双栏内容区 ───────────────────────────── */}
        <div className="mt-10 grid grid-cols-1 gap-12 lg:mt-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* 左栏：主张 + slogan + 方向 + 按钮 */}
          <div className="max-w-xl">
            <p className="reveal lead-statement text-balance">{t(HERO.statement)}</p>

            <ul
              className="reveal mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14.5px] text-muted-foreground"
              data-reveal-delay="140"
            >
              {HERO.focus.map((f, i) => (
                <li key={f.en} className="flex items-center gap-3">
                  {i > 0 ? (
                    <span aria-hidden className="size-1 rounded-full bg-accent-blue" />
                  ) : null}
                  <span>{t(f)}</span>
                </li>
              ))}
            </ul>

            <div className="reveal mt-10 flex flex-wrap items-center gap-7" data-reveal-delay="200">
              <button
                type="button"
                onClick={() => go("papers")}
                className="tap-press inline-flex items-center gap-2 rounded-full bg-accent-blue px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_28px_-14px_var(--accent-blue)] transition-shadow hover:shadow-[0_16px_36px_-14px_var(--accent-blue)]"
              >
                {t(UI.exploreResearch)}
                <ArrowDown size={15} strokeWidth={2.4} />
              </button>

              {PROFILE.resumeUrl ? (
                <a
                  href={PROFILE.resumeUrl}
                  download
                  className="group inline-flex items-baseline gap-2"
                >
                  <span className="story-link text-[15px] font-medium text-foreground">
                    {t(UI.downloadCV)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
                    <Download size={11} />
                    DOCX
                  </span>
                </a>
              ) : null}
            </div>
          </div>

          {/* 右栏：证件照卡 + 联系清单 */}
          <div className="reveal-right reveal flex flex-col gap-8 sm:flex-row lg:flex-col xl:flex-row">
            <figure className="shrink-0">
              <div className="relative w-fit">
                {/* 偏移色块衬底：仅右下露出窄边 */}
                <span
                  aria-hidden
                  className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-2xl bg-accent-blue-soft"
                />
                {imgFailed ? (
                  <div className="relative flex aspect-[3/4] w-[168px] items-center justify-center rounded-2xl bg-accent-blue text-[38px] font-bold text-white sm:w-[188px]">
                    {PROFILE.initials.slice(0, 1)}
                  </div>
                ) : (
                  <img
                    src={AVATAR_URL}
                    alt={t(PROFILE.name)}
                    onError={() => setImgFailed(true)}
                    className="relative aspect-[3/4] w-[168px] rounded-2xl object-cover object-top ring-1 ring-hairline sm:w-[188px]"
                  />
                )}
              </div>
              <figcaption className="mt-4 space-y-1">
                <p className="text-[13.5px] text-muted-foreground">
                  GPA{" "}
                  <span className="text-[15px] font-semibold text-foreground tabular-nums">
                    {HERO.gpa}
                  </span>
                </p>
                <p className="text-[13px] text-muted-foreground tabular-nums">{HERO.rank}</p>
              </figcaption>
            </figure>

            <dl className="flex-1 space-y-5">
              {HERO.contacts.map((c, i) => (
                <div key={c.value}>
                  {i === 0 || c.label.en !== HERO.contacts[i - 1].label.en ? (
                    <dt className="text-[12.5px] text-muted-foreground">{t(c.label)}</dt>
                  ) : null}
                  <dd className={cn("text-[15px] break-all text-foreground", (i === 0 || c.label.en !== HERO.contacts[i - 1].label.en) && "mt-1")}>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="story-link font-medium hover:text-accent-blue"
                      >
                        {c.value}
                      </a>
                    ) : (
                      c.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* ── 滚动提示 ─────────────────────────────── */}
        <div className="reveal mt-14 flex items-center border-t border-hairline pt-6">
          <button
            type="button"
            onClick={() => go("about")}
            aria-label={t(UI.scrollHint)}
            className="group inline-flex items-center gap-2.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span
              aria-hidden
              className="flex h-[22px] w-[13px] items-start justify-center rounded-full border border-current pt-1"
            >
              <span className="animate-wheel size-[3px] rounded-full bg-accent-blue" />
            </span>
            {t(UI.scrollHint)}
          </button>
        </div>
      </div>
    </header>
  );
}
