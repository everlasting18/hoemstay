import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginScreenProps = {
  onSubmit: (email: string, password: string) => Promise<void>;
};

export function LoginScreen({ onSubmit }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onSubmit(email, password);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Đăng nhập thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="hidden rounded-3xl border border-border/70 bg-card/75 p-8 shadow-sm backdrop-blur lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary/80">Windy Hill Admin</p>
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance">
                Quản lý nội dung homestay bằng một dashboard React trực quan hơn.
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                Đăng nhập PocketBase superuser để chỉnh `settings`, `rooms`, `services`, `gallery`, `reviews` và
                `hero_slides`, kèm upload ảnh Cloudinary ngay trong form.
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-border/70 bg-background/80 p-5">
            <p className="text-sm font-medium">Những gì đã có sẵn</p>
            <ul className="grid gap-2 text-sm text-muted-foreground">
              <li>- CRUD cho toàn bộ content chính của site</li>
              <li>- Upload ảnh vào Cloudinary rồi tự đổ URL vào PocketBase</li>
              <li>- Layout responsive cho desktop và mobile</li>
            </ul>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-xl rounded-3xl border-border/70 bg-card/90 shadow-lg shadow-primary/5 backdrop-blur">
          <CardHeader className="space-y-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary lg:hidden">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl tracking-tight">Đăng nhập admin</CardTitle>
              <CardDescription>
                Dùng tài khoản superuser của PocketBase để truy cập dashboard quản trị.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

              <Button className="w-full" type="submit" disabled={submitting}>
                {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
