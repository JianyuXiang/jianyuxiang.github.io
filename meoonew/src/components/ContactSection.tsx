import { useState } from "react";
import { ArrowUp, Check, Copy } from "lucide-react";
import { CONTACT, HERO, PROFILE, UI } from "@/lib/content";
import { useSitePrefs } from "@/hooks/use-site-prefs";
import { SectionShell } from "./SectionShell";
import { cn } from "@/lib/utils";

interface Row {
  key: string;
  label: { zh: string; en: string };
  values: { value: string; href?: string }[];
}

/** 联系：编辑排版的细线行式清单，左标签右值 + 复制动作 */
export function ContactSection() {
  const { t } = useSitePrefs();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // 剪贴板不可用时（如非安全上下文）仍给出反馈，不打断操作
    }
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 2000);
  };

  const rows: Row[] = [
    {
      key: "email",
      label: { zh: "邮箱", en: "Email" },
      values: [
        { value: PROFILE.email, href: `mailto:${PROFILE.email}` },
        { value: HERO.contacts[1].value, href: HERO.contacts[1].href },
      ],
    },
    {
      key: "phone",
      label: { zh: "电话", en: "Phone" },
      values: [{ value: PROFILE.phone, href: `tel:${PROFILE.phone.replace(/\s/g, "")}` }],
    },
    {
      key: "response",
      label: { zh: "响应时间", en: "Response" },
      values: [{ value: t(CONTACT.responseText) }],
    },
  ];

  return (
    <SectionShell
      id="contact"
      eyebrow={{ zh: "联系", en: "Contact" }}
      title={{ zh: "一起交流。", en: "Let's Talk." }}
      lede={CONTACT.lead}
      stats={[
        { value: "<24h", label: { zh: "邮件通常回复时间", en: "Typical email reply" } },
      ]}
    >
      <div className="border-t border-hairline">
        {rows.map((r) => (
          <div key={r.key} className="rule-row reveal grid gap-3 py-7 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto] sm:items-center sm:gap-6">
            <p className="text-[13px] font-bold tracking-[0.06em] text-muted-foreground uppercase">
              {t(r.label)}
            </p>
            <div className="contact-values flex flex-col gap-2">
              {r.values.map((v) => (
                <div key={v.value} className="flex items-center gap-3">
                  {v.href ? (
                    <a
                      href={v.href}
                      className="w-fit text-[19px] font-medium tracking-[-0.02em] underline decoration-hairline underline-offset-4 sm:text-[22px]"
                    >
                      {v.value}
                    </a>
                  ) : (
                    <p className="text-[19px] font-medium tracking-[-0.02em] sm:text-[22px]">{v.value}</p>
                  )}
                  {v.href ? (
                    <button
                      type="button"
                      onClick={() => copy(`${r.key}:${v.value}`, v.value)}
                      className={cn(
                        "tap-press inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
                        copiedKey === `${r.key}:${v.value}`
                          ? "bg-accent-blue text-primary-foreground"
                          : "border border-hairline text-secondary-foreground hover:bg-accent",
                      )}
                      aria-label={`${copiedKey === `${r.key}:${v.value}` ? t(UI.copied) : t({ zh: "复制", en: "Copy" })} ${v.value}`}
                    >
                      {copiedKey === `${r.key}:${v.value}` ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>

            <span />
          </div>
        ))}
      </div>

      <a
        href={`mailto:${PROFILE.email}`}
        className="reveal tap-press mt-10 inline-flex items-center gap-2.5 rounded-full bg-accent-blue px-7 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-[0_10px_28px_-14px_var(--accent-blue)] transition-transform hover:-translate-y-0.5"
      >
        {t(UI.sendEmail)}
        <ArrowUp size={15} className="-rotate-45" aria-hidden />
      </a>
    </SectionShell>
  );
}

/** 页脚：极简一行 + 回到顶部 */
export function SiteFooter() {
  const { t } = useSitePrefs();
  return (
    <footer className="border-t border-hairline px-5 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-[17px] font-bold tracking-[-0.02em]">
            {t(PROFILE.name)}
            <span className="text-accent-blue">.</span>
          </p>
          <p className="mt-1.5 text-[13px] text-muted-foreground">{t(UI.footerNote)}</p>
        </div>
        <div className="flex items-center gap-6">
          <p className="font-mono text-[12px] text-muted-foreground/80 tabular-nums">
            © {new Date().getFullYear()}
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="tap-press inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-blue transition-colors hover:text-foreground"
          >
            <ArrowUp size={13} />
            {t(UI.backToTop)}
          </button>
        </div>
      </div>
    </footer>
  );
}
