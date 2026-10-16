import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { NAV, type SectionId } from "@/lib/content";
import { SitePrefsProvider } from "@/hooks/use-site-prefs";
import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { PapersSection } from "@/components/PapersSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ContactSection, SiteFooter } from "@/components/ContactSection";

export const Route = createFileRoute("/")({
  component: Index,
});

/** 监听滚动，计算当前所在板块用于导航高亮 */
function useActiveSection(): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const onScroll = () => {
      const probe = window.innerHeight * 0.35;
      let current: SectionId | null = null;
      for (const el of sections) {
        if (el.getBoundingClientRect().top <= probe) current = el.id as SectionId;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return active;
}

function PersonalSite() {
  const active = useActiveSection();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar active={active} />
      <main>
        <Hero />
        <AboutSection />
        <PapersSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}

function Index() {
  return (
    <SitePrefsProvider>
      <PersonalSite />
    </SitePrefsProvider>
  );
}
