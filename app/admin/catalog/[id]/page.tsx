"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  CatalogEditor,
  type CatalogEditorPayload,
  type CatalogEditorValue,
} from "@/components/admin/CatalogEditor";

type ApiCatalogItem = {
  dbId: number;
  id: string;
  category: string;
  title: string;
  artist?: string;
  price: string;
  image: string;
  videoSrc?: string;
  images?: string[];
  aspectRatio: "portrait" | "square" | "landscape";
  tags: string[];
  description?: string;
  isNew?: boolean;
  options?: {
    sizes?: string[];
    finishes?: string[];
    fabrics?: string[];
  };
  status: "active" | "draft" | "archived";
  sortOrder: number;
};

function mapToEditorValue(item: ApiCatalogItem): CatalogEditorValue {
  return {
    slug: item.id,
    category: item.category,
    title: item.title,
    artist: item.artist || "",
    price: item.price,
    image: item.image,
    videoSrc: item.videoSrc || "",
    images: item.images || [],
    aspectRatio: item.aspectRatio || "square",
    tags: item.tags || [],
    description: item.description || "",
    isNew: Boolean(item.isNew),
    status: item.status || "active",
    sortOrder: item.sortOrder || 0,
    options: {
      sizes: item.options?.sizes || [],
      finishes: item.options?.finishes || [],
      fabrics: item.options?.fabrics || [],
    },
  };
}

export default function EditCatalogItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [item, setItem] = useState<CatalogEditorValue | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch(`/api/admin/catalog/${id}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (!data?.item) {
          setError("Товар не найден.");
          return;
        }
        setItem(mapToEditorValue(data.item as ApiCatalogItem));
      })
      .catch(() => {
        if (!mounted) return;
        setError("Не удалось загрузить товар.");
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  if (!item) {
    return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/catalog"
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Назад к каталогу
        </Link>
      </div>

      <CatalogEditor
        initial={item}
        onSave={async (payload: CatalogEditorPayload) => {
          const res = await fetch(`/api/admin/catalog/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            throw new Error("Failed to update");
          }
          router.push("/admin/catalog");
          router.refresh();
        }}
        onDelete={async () => {
          const res = await fetch(`/api/admin/catalog/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            throw new Error("Failed to delete");
          }
          router.push("/admin/catalog");
          router.refresh();
        }}
      />
    </div>
  );
}
