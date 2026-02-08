"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Inbox,
  ListChecks,
  Archive,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type DashboardStats = {
  totalRequests: number;
  newRequests: number;
  processingRequests: number;
  archivedRequests: number;
  publishedPosts: number;
  totalPosts: number;
  categories: number;
};

type RecentRequest = {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  form_type: string;
  product?: string | null;
  subject?: string | null;
  created_at: string;
  status: string;
};

type SeriesPoint = { day: string; count: number };

function formatRelative(input: string) {
  const date = new Date(input);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "вчера";
  if (days < 7) return `${days} д`;
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

function dayLabel(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("ru-RU", { weekday: "short" });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<RecentRequest[]>([]);
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/admin/dashboard", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setStats(data.stats || null);
        setRecent(Array.isArray(data.recent) ? data.recent : []);
        setSeries(Array.isArray(data.series) ? data.series : []);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const maxSeries = useMemo(
    () => Math.max(1, ...series.map((s) => s.count)),
    [series],
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Обзор"
        description="Добро пожаловать в панель управления Beloved."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative font-medium">
            <CardTitle className="text-sm text-muted-foreground">
              Новые заявки
            </CardTitle>
            <Inbox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-display font-semibold italic">
              {stats?.newRequests ?? "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Требуют внимания
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Все заявки
            </CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalRequests ?? "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              В работе: {stats?.processingRequests ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Архив
            </CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.archivedRequests ?? "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Закрытые заявки
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Блог
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.publishedPosts ?? "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Всего статей: {stats?.totalPosts ?? "—"}, категорий:{" "}
              {stats?.categories ?? "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Входящие заявки</CardTitle>
            <Link
              href="/admin/requests"
              className="text-xs text-muted-foreground hover:text-accent transition-colors flex items-center"
            >
              В раздел
              <ArrowUpRight size={12} className="ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading && (
                <div className="text-xs text-muted-foreground">Загрузка...</div>
              )}
              {!loading && recent.length === 0 && (
                <div className="text-xs text-muted-foreground">
                  Пока нет заявок.
                </div>
              )}
              {recent.map((item) => {
                const title =
                  item.name || item.email || item.phone || `Заявка #${item.id}`;
                const detail = item.product || item.subject || "Без деталей";
                return (
                  <div
                    key={item.id}
                    data-cursor-hover
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.status === "new"
                            ? "bg-accent"
                            : item.status === "processing"
                              ? "bg-orange-300"
                              : "bg-muted-foreground/50"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium leading-none group-hover:text-accent transition-colors">
                          {title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.form_type} • {detail}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground bg-white/50 px-2 py-1 rounded-md border border-border/20">
                      {formatRelative(item.created_at)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-white/60 backdrop-blur-sm border-border/40 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Активность (Неделя)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full flex items-end justify-between gap-2 pt-4">
              {series.map((point, i) => {
                const height = Math.round((point.count / maxSeries) * 100);
                return (
                  <div
                    key={point.day}
                    className="flex-1 flex flex-col items-center gap-3 group"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{
                        duration: 1,
                        delay: i * 0.1,
                        ease: [0.33, 1, 0.68, 1],
                      }}
                      className="w-full bg-secondary/60 rounded-t-sm group-hover:bg-accent/40 transition-colors relative"
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold">
                        {point.count}
                      </div>
                    </motion.div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      {dayLabel(point.day)}
                    </span>
                  </div>
                );
              })}
              {series.length === 0 && (
                <div className="text-xs text-muted-foreground">
                  Нет данных за неделю.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
