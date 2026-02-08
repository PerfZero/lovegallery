import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRequestById } from "@/lib/db";

function parseOptions(value: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value) as Record<string, string>;
  } catch {
    return null;
  }
}

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) notFound();

  const request = getRequestById(id) as null | {
    id: number;
    form_type: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    subject?: string | null;
    message?: string | null;
    product?: string | null;
    price?: string | null;
    options_json?: string | null;
    status: string;
    notes?: string | null;
    created_at: string;
  };
  if (!request) {
    return (
      <div className="space-y-8">
        <AdminPageHeader
          title={`Заявка #${id}`}
          description="Заявка не найдена или была удалена."
        />
        <Link
          href="/admin/requests"
          className="text-muted-foreground hover:text-foreground"
        >
          ← Назад к списку
        </Link>
      </div>
    );
  }

  const options = parseOptions(request.options_json ?? null);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`Заявка #${request.id}`}
        description="Полная информация по обращению клиента."
      />

      <div className="flex items-center gap-3 text-sm">
        <Link
          href="/admin/requests"
          className="text-muted-foreground hover:text-foreground"
        >
          ← Назад к списку
        </Link>
        <Badge className="bg-accent text-white text-xs">{request.status}</Badge>
      </div>

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Имя
              </div>
              <div className="text-lg font-semibold">{request.name || "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Телефон
              </div>
              <div className="text-lg font-semibold">
                {request.phone || "—"}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Email
              </div>
              <div className="text-lg font-semibold">
                {request.email || "—"}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Тип
              </div>
              <div className="text-lg">{request.form_type}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Тема
              </div>
              <div className="text-lg">{request.subject || "—"}</div>
            </div>
            {request.product && (
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Товар
                </div>
                <div className="text-lg">{request.product}</div>
              </div>
            )}
            {request.price && (
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Цена
                </div>
                <div className="text-lg">{request.price}</div>
              </div>
            )}
          </div>

          {request.message && (
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Сообщение
              </div>
              <div className="mt-2 whitespace-pre-line text-foreground/90">
                {request.message}
              </div>
            </div>
          )}

          {options && (
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Опции
              </div>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(options).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-3">
                    <span className="text-foreground/70">{key}</span>
                    <span className="text-foreground/90">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {request.notes && (
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Заметка
              </div>
              <div className="mt-2 text-foreground/90 whitespace-pre-line">
                {request.notes}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
