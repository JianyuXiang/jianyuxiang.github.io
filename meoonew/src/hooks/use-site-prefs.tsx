import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Bilingual, Lang } from "@/lib/content";

const LANG_KEY = "site-lang";

interface SitePrefs {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  /** 按当前语言取双语文案 */
  t: (v: Bilingual) => string;
}

const Ctx = createContext<SitePrefs | null>(null);

/** 全站固定浅色（编辑排版风），仅保留语言偏好 */
export function SitePrefsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored === "zh" || stored === "en") setLangState(stored);
    } catch {
      /* 隐私模式下忽略 */
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
    // 清掉历史遗留的深色标记，避免老访客本地记录影响渲染
    document.documentElement.classList.remove("dark");
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "zh" ? "en" : "zh");
  }, [lang, setLang]);

  const value = useMemo<SitePrefs>(
    () => ({ lang, setLang, toggleLang, t: (v: Bilingual) => v[lang] }),
    [lang, setLang, toggleLang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSitePrefs(): SitePrefs {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSitePrefs 必须在 SitePrefsProvider 内使用");
  return ctx;
}
