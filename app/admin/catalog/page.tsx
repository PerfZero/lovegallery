"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type AdminCatalogItem = {
  dbId: number;
  id: string;
  category: string;
  title: string;
  price: string;
  image: string;
  status: string;
  sortOrder: number;
};

export default function AdminCatalogPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<AdminCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/catalog", { cache: "no-store" });
      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch {
      setItems([]);
      setError("Не удалось загрузить каталог.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      [item.title, item.id, item.category, item.price]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [items, query]);

  const deleteItem = async (dbId: number) => {
    try {
      const res = await fetch(`/api/admin/catalog/${dbId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("Не удалось удалить товар.");
        return;
      }
      await loadItems();
    } catch {
      setError("Не удалось удалить товар.");
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Каталог"
        description="Список всех товаров. Для удобного заполнения используйте отдельную страницу редактирования."
        action={
          <Link href="/admin/catalog/new">
            <Button className="bg-foreground text-background hover:bg-foreground/90 font-medium">
              <Plus className="mr-2 h-4 w-4" />
              Новый товар
            </Button>
          </Link>
        }
      />

      <div className="flex items-center space-x-4 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск по каталогу..."
            className="pl-9 bg-white/60 border-border/40"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="w-full text-left text-sm">
            <div className="flex items-center border-b border-border/40 bg-secondary/30 p-4 font-medium text-muted-foreground">
              <div className="w-20 pl-4">Фото</div>
              <div className="flex-1">Название</div>
              <div className="w-36 hidden md:block">Категория</div>
              <div className="w-36 hidden md:block">Цена</div>
              <div className="w-28 hidden md:block">Статус</div>
              <div className="w-28 hidden md:block">Порядок</div>
              <div className="w-36" />
            </div>

            <div className="divide-y divide-border/40">
              {loading && (
                <div className="p-4 text-sm text-muted-foreground">Загрузка...</div>
              )}

              {!loading && filtered.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">
                  Товары не найдены.
                </div>
              )}

              {!loading &&
                filtered.map((item) => (
                  <div
                    key={item.dbId}
                    className="flex items-center p-4 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="w-20 pl-4">
                      <div
                        className="h-10 w-10 rounded-md bg-cover bg-center border border-border/30"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    </div>
                    <div className="flex-1 font-medium text-foreground">
                      {item.title}
                      <div className="text-xs text-muted-foreground mt-1">
                        ID: {item.id}
                      </div>
                    </div>
                    <div className="w-36 hidden md:block text-muted-foreground capitalize">
                      {item.category}
                    </div>
                    <div className="w-36 hidden md:block text-muted-foreground">
                      {item.price}
                    </div>
                    <div className="w-28 hidden md:block">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          item.status === "active"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : item.status === "draft"
                              ? "border-amber-200 bg-amber-50 text-amber-700"
                              : "border-zinc-200 bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        {item.status === "active"
                          ? "Активен"
                          : item.status === "draft"
                            ? "Черновик"
                            : "Архив"}
                      </span>
                    </div>
                    <div className="w-28 hidden md:block text-muted-foreground">
                      {item.sortOrder}
                    </div>
                    <div className="w-36 flex justify-end gap-1">
                      <Link href={`/admin/catalog/${item.dbId}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Товар «{item.title}» будет удален без возможности
                              восстановления.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => void deleteItem(item.dbId)}
                            >
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
