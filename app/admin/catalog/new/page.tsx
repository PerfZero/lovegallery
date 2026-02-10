"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  CatalogEditor,
  type CatalogEditorPayload,
} from "@/components/admin/CatalogEditor";

export default function NewCatalogItemPage() {
  const router = useRouter();

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
        onSave={async (payload: CatalogEditorPayload) => {
          const res = await fetch("/api/admin/catalog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            throw new Error("Failed to create");
          }
          router.push("/admin/catalog");
          router.refresh();
        }}
      />
    </div>
  );
}
