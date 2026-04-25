import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, DatabaseZap } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { CollectionManager } from "@/components/CollectionManager";
import { LoginScreen } from "@/components/LoginScreen";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Toast } from "@/components/Toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminSections } from "@/config/collections";
import { getPocketBaseUrl, listRecords, loginSuperuser } from "@/lib/pocketbase";
import type { AdminSession, PocketBaseRecord, SectionKey } from "@/lib/types";

type CollectionState = Record<string, PocketBaseRecord[]>;

const SESSION_KEY = "windy-hill-admin-session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;    // 12 giờ
const INACTIVITY_MS = 8 * 60 * 60 * 1000;       // 8 giờ không thao tác

function loadStoredSession(): AdminSession | null {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed.token || !parsed.email) return null;
    if (!parsed.expiresAt || Date.now() > parsed.expiresAt) return null; // hết hạn
    return parsed;
  } catch {
    return null;
  }
}

function saveSession(session: AdminSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export type ToastMessage = {
  id: number;
  message: string;
  type: "success" | "error";
};

export function App() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [activeSectionKey, setActiveSectionKey] = useState<SectionKey>(adminSections[0]?.key ?? "settings");
  const [data, setData] = useState<CollectionState>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const handleLogout = useCallback((reason?: string) => {
    clearSession();
    setSession(null);
    setData({});
    setError(null);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (reason) addToast(reason, "error");
  }, [addToast]);

  // Reset inactivity timer khi user thao tác
  const resetInactivity = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      handleLogout("Phiên làm việc hết hạn do không hoạt động.");
    }, INACTIVITY_MS);
  }, [handleLogout]);

  useEffect(() => {
    setSession(loadStoredSession());
  }, []);

  // Gắn event listener theo dõi inactivity khi đã đăng nhập
  useEffect(() => {
    if (!session) return;

    const events = ["mousemove", "keydown", "pointerdown", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetInactivity, { passive: true }));
    resetInactivity();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetInactivity));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [session, resetInactivity]);

  const loadCollections = useCallback(async (nextSession: AdminSession) => {
    setLoading(true);
    setError(null);

    try {
      const entries = await Promise.all(
        adminSections.map(async (section) => [
          section.key,
          await listRecords(section.key, nextSession.token, section.singleton ? {} : section.sort ? { sort: section.sort } : {})
        ])
      );

      setData(Object.fromEntries(entries));
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Không thể tải dữ liệu từ PocketBase.";
      // Token hết hạn phía PocketBase → tự logout
      if (message.includes("401") || message.toLowerCase().includes("unauthorized")) {
        handleLogout("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    if (!session) return;
    void loadCollections(session);
  }, [session, loadCollections]);

  const handleLogin = async (email: string, password: string) => {
    const raw = await loginSuperuser(email, password);
    const nextSession: AdminSession = {
      ...raw,
      expiresAt: Date.now() + SESSION_TTL_MS
    };
    saveSession(nextSession);
    setSession(nextSession);
  };

  const activeSection = useMemo(
    () => adminSections.find((section) => section.key === activeSectionKey) ?? adminSections[0],
    [activeSectionKey]
  );

  if (!getPocketBaseUrl()) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <Card className="w-full max-w-2xl rounded-lg border-border/70 bg-card/90 shadow-lg shadow-primary/5">
          <CardHeader className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl tracking-tight">Thiếu `VITE_POCKETBASE_URL`</CardTitle>
              <CardDescription className="text-base leading-7">
                Tạo file `.env` trong `admin/` và đặt `VITE_POCKETBASE_URL=http://127.0.0.1:8090` hoặc domain
                PocketBase thật trước khi mở dashboard.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border/70 bg-muted/50 p-4">
              <code className="text-sm">VITE_POCKETBASE_URL=http://127.0.0.1:8090</code>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return <LoginScreen onSubmit={handleLogin} />;
  }

  if (!activeSection) return null;

  return (
    <>
      <AdminShell
        sections={adminSections}
        activeSectionKey={activeSection.key}
        onSelectSection={setActiveSectionKey}
        onLogout={() => handleLogout()}
        email={session.email}
      >
        <div className="space-y-4">
          {error ? (
            <Card className="rounded-lg border-destructive/20 bg-destructive/5">
              <CardContent className="flex items-start gap-3 p-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">Tải dữ liệu thất bại</p>
                  <p className="text-sm text-destructive/90">{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {loading ? (
            <Card className="rounded-lg border-border/70 bg-card/85">
              <CardContent className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
                <DatabaseZap className="h-4 w-4 text-primary" />
                Đang tải dữ liệu từ PocketBase...
              </CardContent>
            </Card>
          ) : null}

          {!loading && (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{activeSection.title}</Badge>
              <Badge variant="outline">{activeSection.singleton ? "Singleton record" : `${data[activeSection.key]?.length ?? 0} record(s)`}</Badge>
            </div>
          )}

          {!loading && activeSection.singleton ? (
            <SettingsPanel
              config={activeSection}
              record={data[activeSection.key]?.[0] ?? null}
              token={session.token}
              onReload={() => loadCollections(session)}
              onToast={addToast}
            />
          ) : null}

          {!loading && !activeSection.singleton ? (
            <CollectionManager
              config={activeSection}
              records={data[activeSection.key] ?? []}
              token={session.token}
              onReload={() => loadCollections(session)}
              onToast={addToast}
            />
          ) : null}
        </div>
      </AdminShell>

      <Toast toasts={toasts} />
    </>
  );
}
