"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  MoreHorizontal,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  Archive,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RequestItem = {
  id: number;
  form_type: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string | null;
  product: string | null;
  price: string | null;
  options_json: string | null;
  notes: string | null;
  status: "new" | "processing" | "done";
  priority: number;
  created_at: string;
};

function formatRelative(dateStr: string) {
  const date = new Date(dateStr.replace(" ", "T") + "Z");
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин. назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч. назад`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "вчера";
  return `${days} дн. назад`;
}

function getDetails(item: RequestItem) {
  if (item.product) return item.product;
  if (item.subject) return item.subject;
  if (item.message) return item.message;
  return "Без описания";
}

export default function AdminRequestsPage() {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "new" | "processing" | "done">(
    "all",
  );
  const [loading, setLoading] = useState(true);
  const [openNotes, setOpenNotes] = useState<Record<number, boolean>>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<number, string>>({});

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch("/api/admin/requests", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch(() => {
        if (!isMounted) return;
        setItems([]);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (status !== "all" && item.status !== status) return false;
      if (!q) return true;
      const haystack = [
        item.name,
        item.email,
        item.phone,
        item.subject,
        item.product,
        item.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query, status]);

  const counts = useMemo(() => {
    return {
      all: items.length,
      new: items.filter((i) => i.status === "new").length,
      processing: items.filter((i) => i.status === "processing").length,
      done: items.filter((i) => i.status === "done").length,
    };
  }, [items]);

  const updateItem = (id: number, patch: Partial<RequestItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const patchRequest = async (
    id: number,
    payload: { status?: string; priority?: number; notes?: string },
  ) => {
    const res = await fetch(`/api/admin/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("Failed to update");
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Заявки"
        description="Управление входящими обращениями клиентов."
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск по имени, email или телефону..."
            className="pl-9 bg-white/60 border-border/40"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Button
            variant={status === "all" ? "outline" : "ghost"}
            className="text-muted-foreground border-border/40 whitespace-nowrap"
            onClick={() => setStatus("all")}
          >
            Все ({counts.all})
          </Button>
          <Button
            variant={status === "new" ? "outline" : "ghost"}
            className="text-muted-foreground whitespace-nowrap"
            onClick={() => setStatus("new")}
          >
            Новые ({counts.new})
          </Button>
          <Button
            variant={status === "processing" ? "outline" : "ghost"}
            className="text-muted-foreground whitespace-nowrap"
            onClick={() => setStatus("processing")}
          >
            В работе ({counts.processing})
          </Button>
          <Button
            variant={status === "done" ? "outline" : "ghost"}
            className="text-muted-foreground whitespace-nowrap"
            onClick={() => setStatus("done")}
          >
            Архив ({counts.done})
          </Button>
        </div>
      </div>

      {/* CRM List */}
      <div className="grid gap-4">
        {loading && (
          <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
            <CardContent className="p-6 text-sm text-muted-foreground">
              Загрузка...
            </CardContent>
          </Card>
        )}
        {!loading && filtered.length === 0 && (
          <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
            <CardContent className="p-6 text-sm text-muted-foreground">
              Заявок пока нет.
            </CardContent>
          </Card>
        )}
        {filtered.map((request) => (
          <Card
            key={request.id}
            className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm hover:shadow-md transition-all group"
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-full mt-1 ${request.status === "new" ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"}`}
                  >
                    {request.status === "new" && <Clock size={20} />}
                    {request.status === "processing" && (
                      <Clock size={20} className="text-orange-500" />
                    )}
                    {request.status === "done" && (
                      <CheckCircle size={20} className="text-green-500" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/requests/${request.id}`}
                        className="font-semibold text-foreground text-lg hover:text-accent transition-colors"
                      >
                        {request.name || "Без имени"}
                      </Link>
                      {request.status === "new" && (
                        <Badge
                          variant="default"
                          className="bg-accent text-white text-xs h-5"
                        >
                          Новая
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground/80 font-medium flex items-center gap-2">
                      {request.form_type}:{" "}
                      <span className="text-muted-foreground font-normal">
                        {getDetails(request)}
                      </span>
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                      {request.phone && (
                        <span className="flex items-center gap-1 hover:text-accent cursor-pointer transition-colors">
                          <Phone size={12} />
                          {request.phone}
                        </span>
                      )}
                      {request.email && (
                        <span className="flex items-center gap-1 hover:text-accent cursor-pointer transition-colors">
                          <Mail size={12} />
                          {request.email}
                        </span>
                      )}
                      <span>•</span>
                      <span>{formatRelative(request.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`hover:text-amber-400 ${request.priority ? "text-amber-400" : "text-muted-foreground"}`}
                    onClick={async () => {
                      const nextPriority = request.priority ? 0 : 1;
                      updateItem(request.id, { priority: nextPriority });
                      try {
                        await patchRequest(request.id, {
                          priority: nextPriority,
                        });
                      } catch {
                        updateItem(request.id, { priority: request.priority });
                      }
                    }}
                    aria-label="Приоритет"
                  >
                    <Star
                      size={18}
                      className={request.priority ? "fill-amber-400" : ""}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`hidden group-hover:flex ${request.status === "processing" ? "text-accent border-accent/40" : ""}`}
                    onClick={async () => {
                      const nextStatus =
                        request.status === "processing" ? "new" : "processing";
                      updateItem(request.id, { status: nextStatus });
                      try {
                        await patchRequest(request.id, { status: nextStatus });
                      } catch {
                        updateItem(request.id, { status: request.status });
                      }
                    }}
                  >
                    В работу
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`${request.status === "done" ? "text-accent" : "text-muted-foreground"} hover:text-foreground`}
                    onClick={async () => {
                      const nextStatus =
                        request.status === "done" ? "new" : "done";
                      updateItem(request.id, { status: nextStatus });
                      try {
                        await patchRequest(request.id, { status: nextStatus });
                      } catch {
                        updateItem(request.id, { status: request.status });
                      }
                    }}
                    aria-label="Архив"
                  >
                    <Archive size={18} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Действия"
                      >
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          setOpenNotes((prev) => ({
                            ...prev,
                            [request.id]: !prev[request.id],
                          }))
                        }
                      >
                        Заметка
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="mt-3">
                <Link
                  href={`/admin/requests/${request.id}`}
                  className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
                >
                  Открыть
                </Link>
              </div>

              {openNotes[request.id] && (
                <div className="mt-4 border-t border-border/20 pt-4">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Заметка
                  </label>
                  <textarea
                    className="w-full min-h-[80px] bg-white/70 border border-border/40 rounded-md p-3 text-sm focus:outline-none focus:border-accent"
                    placeholder="Добавьте комментарий по заявке..."
                    value={noteDrafts[request.id] ?? request.notes ?? ""}
                    onChange={(e) =>
                      setNoteDrafts((prev) => ({
                        ...prev,
                        [request.id]: e.target.value,
                      }))
                    }
                  />
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={async () => {
                        const value =
                          noteDrafts[request.id] ?? request.notes ?? "";
                        updateItem(request.id, { notes: value });
                        try {
                          await patchRequest(request.id, { notes: value });
                        } catch {
                          updateItem(request.id, {
                            notes: request.notes ?? "",
                          });
                        }
                      }}
                    >
                      Сохранить
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground"
                      onClick={() =>
                        setOpenNotes((prev) => ({
                          ...prev,
                          [request.id]: false,
                        }))
                      }
                    >
                      Скрыть
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
