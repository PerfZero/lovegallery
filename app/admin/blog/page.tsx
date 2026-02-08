"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreHorizontal, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type BlogRow = {
  id: number;
  slug: string;
  title: string;
  category?: string | null;
  status: string;
  date?: string | null;
};

export default function AdminBlogPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/admin/blog", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch(() => {
        if (!mounted) return;
        setItems([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((a) =>
      [a.title, a.category, a.slug]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [items, query]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Блог"
        description="Управление статьями и публикациями."
        action={
          <Link href="/admin/blog/new">
            <Button className="bg-foreground text-background hover:bg-foreground/90 font-medium">
              <Plus className="mr-2 h-4 w-4" />
              Написать статью
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск статей..."
            className="pl-9 bg-white/60 border-border/40"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-muted-foreground border-border/40"
          >
            Все ({items.length})
          </Button>
          <Button variant="ghost" className="text-muted-foreground">
            Опубликованные (
            {items.filter((a) => a.status === "published").length})
          </Button>
          <Button variant="ghost" className="text-muted-foreground">
            Черновики ({items.filter((a) => a.status === "draft").length})
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="w-full text-left text-sm">
            {/* Header */}
            <div className="flex items-center border-b border-border/40 bg-secondary/30 p-4 font-medium text-muted-foreground">
              <div className="w-12 pl-2"></div>
              <div className="flex-1">Заголовок</div>
              <div className="w-32 hidden md:block">Категория</div>
              <div className="w-32 hidden md:block">Дата</div>
              <div className="w-32 hidden md:block">Статус</div>
              <div className="w-10"></div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border/40">
              {loading && (
                <div className="p-4 text-sm text-muted-foreground">
                  Загрузка...
                </div>
              )}
              {!loading && filtered.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">
                  Статей пока нет.
                </div>
              )}
              {filtered.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center p-4 hover:bg-secondary/40 transition-colors group cursor-pointer"
                >
                  <div className="w-12 pl-2 text-muted-foreground">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1 font-medium text-foreground">
                    <Link
                      href={`/admin/blog/${article.id}`}
                      className="hover:text-accent transition-colors"
                    >
                      {article.title}
                    </Link>
                    <div className="md:hidden text-xs text-muted-foreground mt-1">
                      {article.status} • {article.date}
                    </div>
                  </div>
                  <div className="w-32 hidden md:block text-muted-foreground">
                    {article.category}
                  </div>
                  <div className="w-32 hidden md:block text-muted-foreground">
                    {article.date}
                  </div>
                  <div className="w-32 hidden md:block">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        article.status === "published"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {article.status === "published"
                        ? "Опубликован"
                        : "Черновик"}
                    </span>
                  </div>
                  <div className="w-10 flex justify-end pr-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
