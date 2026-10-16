import { useEffect, useState } from "react";
import { NAV, UI, type SectionId } from "@/lib/content";
import { useSitePrefs } from "@/hooks/use-site-prefs";
import { cn } from "@/lib/utils";

interface NavBarProps {
  active: SectionId | null;
}

/** 编辑排版式顶栏：缩写标识 + 文字锚点（下划线指示当前板块）+ 胶囊语言开关 */
export function NavBar({ active }: NavBarProps) {
  const { t, lang, setLang } = useSitePrefs();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className={cn(
        "ios-glass fixed inset-x-0 top-0 z-50 transition-shadow duration-300",
        scrolled && "shadow-ios",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-4 px-5 sm:h-16 sm:px-8 lg:px-12">
        {/* 缩写标识 */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={lang === "zh" ? "回到顶部" : "Back to top"}
          className="tap-press shrink-0 font-display text-[22px] leading-none font-extrabold tracking-[-0.04em]"
        >
          JY.
          <span className="text-accent-blue">X</span>
        </button>

        {/* 锚点（桌面） */}
        <div className="no-scrollbar mx-auto hidden items-center gap-9 overflow-x-auto lg:flex">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              className={cn(
                "relative py-1 text-[14.5px] whitespace-nowrap transition-colors duration-200",
                active === item.id
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label[lang]}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent-blue transition-transform duration-300",
                  active === item.id ? "scale-x-100" : "scale-x-0",
                )}
              />
            </button>
          ))}
        </div>

        <div className="flex-1 lg:hidden" />

        {/* 语言开关 */}
        <div
          role="group"
          aria-label={t(UI.language)}
          className="flex shrink-0 items-center gap-0.5 rounded-full border border-hairline bg-card p-1"
        >
          {(["zh", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={cn(
                "tap-press size-8 rounded-full text-[12.5px] font-semibold transition-colors duration-200",
                lang === l
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l === "zh" ? "中" : "EN"}
            </button>
          ))}
        </div>
      </div>

      {/* 锚点（移动端横滑） */}
      <div className="no-scrollbar overflow-x-auto border-t border-hairline px-5 py-1.5 lg:hidden">
        <div className="flex w-max gap-6">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              className={cn(
                "py-0.5 text-[13.5px] whitespace-nowrap transition-colors",
                active === item.id
                  ? "font-medium text-accent-blue"
                  : "text-muted-foreground",
              )}
            >
              {item.label[lang]}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
