"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BlogEditor,
  type BlogEditorValue,
} from "@/components/admin/BlogEditor";
import { ArrowLeft } from "lucide-react";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [initial, setInitial] = useState<Partial<BlogEditorValue> | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/admin/blog/${id}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const item = data.item;
        if (!item) return;
        setInitial({
          title: item.title,
          subtitle: item.subtitle || "",
          category: item.category || "",
          date: item.date || "",
          slug: item.slug,
          status: item.status || "published",
          image: item.image || "",
          contentText: item.content_text || "",
          contentJson: item.content_json || null,
        });
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!initial) {
    return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blog"
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Назад к блогу
        </Link>
      </div>

      <BlogEditor
        initial={initial}
        onSave={async (payload) => {
          const res = await fetch(`/api/admin/blog/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: payload.title,
              subtitle: payload.subtitle,
              category: payload.category,
              date: payload.date,
              slug: payload.slug,
              status: payload.status,
              image: payload.image,
              contentText: payload.contentText,
            }),
          });
          if (res.ok) {
            router.push("/admin/blog");
            router.refresh();
          }
        }}
        onDelete={async () => {
          const res = await fetch(`/api/admin/blog/${id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            router.push("/admin/blog");
            router.refresh();
          }
        }}
      />
    </div>
  );
}
