import { useState, type ReactNode } from "react";
import {
  BedDouble,
  GalleryHorizontalEnd,
  Images,
  LogOut,
  Menu,
  MessageSquareQuote,
  Mountain,
  PanelsTopLeft,
  Settings,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import type { AdminSection, SectionKey } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type AdminShellProps = {
  sections: AdminSection[];
  activeSectionKey: SectionKey;
  onSelectSection: (sectionKey: SectionKey) => void;
  onLogout: () => void;
  email: string;
  children: ReactNode;
};

const sectionIcons: Record<SectionKey, LucideIcon> = {
  settings: Settings,
  hero_slides: Images,
  rooms: BedDouble,
  services: Sparkles,
  gallery: GalleryHorizontalEnd,
  reviews: MessageSquareQuote
};

function SectionNav({
  sections,
  activeSectionKey,
  onSelectSection,
  compact = false
}: {
  sections: AdminSection[];
  activeSectionKey: SectionKey;
  onSelectSection: (sectionKey: SectionKey) => void;
  compact?: boolean;
}) {
  return (
    <nav className={cn("grid gap-2", compact && "gap-1.5")}>
      {sections.map((section) => {
        const active = section.key === activeSectionKey;
        return (
          <button
            key={section.key}
            type="button"
            onClick={() => onSelectSection(section.key)}
            className={cn(
              "rounded-xl border px-4 py-3 text-left transition-colors",
              active
                ? "border-primary/30 bg-primary/10 text-foreground shadow-sm"
                : "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-muted/70 hover:text-foreground",
              compact && "px-3 py-2.5"
            )}
          >
            <div className="text-sm font-semibold">{section.title}</div>
            <div className="mt-1 text-xs leading-5 text-muted-foreground">{section.description}</div>
          </button>
        );
      })}
    </nav>
  );
}

export function AdminShell({
  sections,
  activeSectionKey,
  onSelectSection,
  onLogout,
  email,
  children
}: AdminShellProps) {
  const activeSection = sections.find((section) => section.key === activeSectionKey) ?? sections[0];
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mobileBottomSections = sections.filter((section) =>
    ["settings", "hero_slides", "rooms", "services", "gallery"].includes(section.key)
  );
  const activeInBottomNav = mobileBottomSections.some((section) => section.key === activeSectionKey);

  const handleMobileSelectSection = (sectionKey: SectionKey) => {
    onSelectSection(sectionKey);
    setMobileNavOpen(false);
  };

  const handleMobileLogout = () => {
    setMobileNavOpen(false);
    onLogout();
  };

  return (
    <div className="app-shell">
      <div className="app-container">
        <aside className="hidden w-[300px] shrink-0 border-r border-border/70 bg-card/70 lg:block">
          <div className="sticky top-0 flex h-screen flex-col">
            <div className="space-y-5 px-5 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Mountain className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Windy Hill</div>
                  <div className="text-sm text-muted-foreground">Admin Dashboard</div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                <div className="text-sm font-medium">Đăng nhập bằng</div>
                <div className="mt-1 break-all text-sm text-muted-foreground">{email}</div>
              </div>
            </div>

            <Separator />

            <ScrollArea className="flex-1 px-4 py-4">
              <SectionNav sections={sections} activeSectionKey={activeSectionKey} onSelectSection={onSelectSection} />
            </ScrollArea>

            <div className="border-t border-border/70 p-4">
              <Button className="w-full justify-start" variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-6 sm:py-4">
              <div className="flex min-w-0 items-center gap-3">
                <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                  <SheetTrigger asChild>
                    <Button className="h-11 w-11 shrink-0 lg:hidden" variant="outline" size="icon">
                      <Menu className="h-4 w-4" />
                      <span className="sr-only">Open navigation</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[88vw] max-w-sm p-0">
                    <SheetHeader className="border-b border-border/70 px-5 py-5">
                      <SheetTitle className="flex items-center gap-2">
                        <PanelsTopLeft className="h-4 w-4" />
                        Điều hướng admin
                      </SheetTitle>
                      <SheetDescription>Chọn collection bạn muốn quản lý.</SheetDescription>
                    </SheetHeader>
                    <div className="px-4 py-4">
                      <SectionNav
                        sections={sections}
                        activeSectionKey={activeSectionKey}
                        onSelectSection={handleMobileSelectSection}
                        compact
                      />
                      <Button className="mt-4 w-full justify-start" variant="outline" onClick={handleMobileLogout}>
                        <LogOut className="h-4 w-4" />
                        Đăng xuất
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="truncate text-lg font-semibold tracking-tight sm:text-2xl">{activeSection?.title}</h1>
                    <Badge variant="secondary" className="hidden sm:inline-flex">
                      {activeSection?.singleton ? "Singleton" : "Collection"}
                    </Badge>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground sm:mt-1 sm:line-clamp-2 sm:text-sm">
                    {activeSection?.description}
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-2 lg:flex">
                <Badge variant="outline" className="max-w-[280px] truncate">
                  {email}
                </Badge>
                <Button variant="outline" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 pb-24 pt-3 sm:px-6 sm:py-6 lg:pb-6">{children}</main>

          <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-12px_28px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
            <div className="mx-auto grid max-w-lg grid-cols-6 gap-1">
              {mobileBottomSections.map((section) => {
                const active = section.key === activeSectionKey;
                const Icon = sectionIcons[section.key];

                return (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => handleMobileSelectSection(section.key)}
                    className={cn(
                      "flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-xs font-medium transition-colors",
                      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="max-w-full truncate">
                      {section.key === "settings" ? "Site" : section.key === "hero_slides" ? "Hero" : section.title}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className={cn(
                  "flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-xs font-medium transition-colors",
                  !activeInBottomNav ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Menu className="h-5 w-5" />
                <span>Thêm</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
