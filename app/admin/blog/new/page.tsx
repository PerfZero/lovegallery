"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewArticlePage() {
  const router = useRouter();

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
        onSave={async (payload) => {
          const res = await fetch("/api/admin/blog", {
            method: "POST",
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
      />
    </div>
  );
}
