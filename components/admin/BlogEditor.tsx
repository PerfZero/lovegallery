"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SaveBar } from "@/components/admin/save-bar";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UploadCloud,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Link2,
} from "lucide-react";
import { slugify } from "@/lib/blog-utils";

export type BlogEditorValue = {
  title: string;
  subtitle: string;
  category: string;
  date: string;
  slug: string;
  status: "published" | "draft";
  image: string;
  contentText?: string;
  contentJson?: unknown;
};

type BlogEditorPayload = {
  title: string;
  subtitle: string;
  category: string;
  date: string;
  slug: string;
  status: "published" | "draft";
  image: string;
  contentText: string;
};

type BlogPayloadInput = {
  title: string;
  subtitle: string;
  category: string;
  date: string;
  slug: string;
  status: "published" | "draft";
  image: string;
  html: string;
};

type ContentBlock = {
  type?: string;
  text?: string;
  items?: string[];
};

function htmlToText(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDateRu(date = new Date()) {
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function computeReadTimeFromHtml(html: string) {
  const text = htmlToText(html);
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} мин`;
}

function blocksToHtml(blocks: ContentBlock[]) {
  return blocks
    .map((b) => {
      if (b.type === "heading") return `<h2>${b.text || ""}</h2>`;
      if (b.type === "list") {
        const items = (b.items || [])
          .map((i: string) => `<li>${i}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${b.text || ""}</p>`;
    })
    .join("");
}

function markdownishToHtml(text: string) {
  const lines = text.split("\n");
  const out: string[] = [];
  let listOpen = false;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (listOpen) {
        out.push("</ul>");
        listOpen = false;
      }
      out.push(`<h2>${line.replace(/^##\s+/, "")}</h2>`);
      continue;
    }
    if (line.startsWith("- ")) {
      if (!listOpen) {
        out.push("<ul>");
        listOpen = true;
      }
      out.push(`<li>${line.replace(/^-\s+/, "")}</li>`);
      continue;
    }
    if (line.trim()) {
      if (listOpen) {
        out.push("</ul>");
        listOpen = false;
      }
      out.push(`<p>${line}</p>`);
    }
  }
  if (listOpen) out.push("</ul>");
  return out.join("");
}

function resolveInitialContent(initial?: Partial<BlogEditorValue>) {
  if (!initial) return "<p></p>";
  if (typeof initial.contentText === "string" && initial.contentText.trim()) {
    const raw = initial.contentText.trim();
    if (/<[^>]+>/.test(raw)) return raw;
    return markdownishToHtml(raw);
  }
  if (initial.contentJson) {
    try {
      const blocks =
        typeof initial.contentJson === "string"
          ? JSON.parse(initial.contentJson)
          : initial.contentJson;
      if (Array.isArray(blocks) && blocks.length) {
        return blocksToHtml(blocks as ContentBlock[]);
      }
    } catch {}
  }
  return "<p></p>";
}

function stripStyles(html: string) {
  let cleaned = html.replace(/\sstyle="[^"]*"/g, "");
  // unwrap spans left after removing styles
  let prev = "";
  while (prev !== cleaned) {
    prev = cleaned;
    cleaned = cleaned.replace(/<span>(.*?)<\/span>/g, "$1");
  }
  return cleaned;
}

function normalizeMarkdownBold(html: string) {
  return html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function buildBlogPayload(input: BlogPayloadInput): BlogEditorPayload {
  return {
    title: input.title,
    subtitle: input.subtitle,
    category: input.category,
    date: input.date,
    slug: input.slug,
    status: input.status,
    image: input.image,
    contentText: normalizeMarkdownBold(stripStyles(input.html)),
  };
}

export function BlogEditor({
  initial,
  onSave,
  onDelete,
}: {
  initial?: Partial<BlogEditorValue>;
  onSave: (payload: BlogEditorPayload) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [date, setDate] = useState(initial?.date || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [status, setStatus] = useState<"published" | "draft">(
    initial?.status || "published",
  );
  const [image, setImage] = useState(initial?.image || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [readTime, setReadTime] = useState("—");
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const editorRef = useRef<HTMLDivElement | null>(null);
  const initialContentRef = useRef<string>(resolveInitialContent(initial));
  const [contentHtmlState, setContentHtmlState] = useState(
    initialContentRef.current,
  );
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(
      buildBlogPayload({
        title: initial?.title || "",
        subtitle: initial?.subtitle || "",
        category: initial?.category || "",
        date: initial?.date || "",
        slug: initial?.slug || "",
        status: initial?.status || "published",
        image: initial?.image || "",
        html: initialContentRef.current,
      }),
    ),
  );

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  useEffect(() => {
    if (status === "published" && !date) setDate(formatDateRu(new Date()));
  }, [status, date]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/blog/categories", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const items = Array.isArray(data.items) ? data.items : [];
        setCategories(
          items
            .map((item: unknown) =>
              item && typeof item === "object" && "name" in item
                ? String((item as { name?: unknown }).name || "")
                : "",
            )
            .filter(Boolean),
        );
      })
      .catch(() => {
        if (!mounted) return;
        setCategories([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = initialContentRef.current;
    setContentHtmlState(initialContentRef.current);
    setReadTime(computeReadTimeFromHtml(initialContentRef.current));
  }, []);

  const contentHtml = () => editorRef.current?.innerHTML || "";

  const readTimeLabel = useMemo(() => readTime, [readTime]);

  const applyCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const keepFocus = (event: React.MouseEvent) => {
    event.preventDefault();
    editorRef.current?.focus();
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) setImage(data.url);
    } finally {
      setUploading(false);
    }
  };

  const handleAddCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;
    const res = await fetch("/api/admin/blog/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) return;
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];
    setCategories(
      items
        .map((item: unknown) =>
          item && typeof item === "object" && "name" in item
            ? String((item as { name?: unknown }).name || "")
            : "",
        )
        .filter(Boolean),
    );
    setCategory(name);
    setNewCategory("");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = buildBlogPayload({
        title,
        subtitle,
        category,
        date,
        slug,
        status,
        image,
        html: contentHtml(),
      });
      await onSave(payload);
      setSavedSnapshot(JSON.stringify(payload));
      toast.success("Изменения сохранены");
    } catch {
      toast.error("Не удалось сохранить изменения");
    } finally {
      setSaving(false);
    }
  };

  const isDirty = useMemo(
    () =>
      JSON.stringify(
        buildBlogPayload({
          title,
          subtitle,
          category,
          date,
          slug,
          status,
          image,
          html: contentHtmlState,
        }),
      ) !== savedSnapshot,
    [
      title,
      subtitle,
      category,
      date,
      slug,
      status,
      image,
      contentHtmlState,
      savedSnapshot,
    ],
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Заголовок</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Подзаголовок</Label>
          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Категория</Label>
          <div className="flex flex-col md:flex-row gap-3">
            <select
              className="h-10 px-3 rounded-md border border-border/40 bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Без категории</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <div className="flex gap-2 flex-1">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Новая категория"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddCategory}
              >
                Добавить
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Дата публикации</Label>
          <Input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder={formatDateRu(new Date())}
          />
        </div>
        <div className="space-y-2">
          <Label>Время чтения</Label>
          <div className="h-10 px-3 rounded-md border border-border/40 bg-white/60 flex items-center text-sm text-muted-foreground">
            {readTimeLabel}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Статус</Label>
          <select
            className="w-full h-10 px-3 rounded-md border border-border/40 bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value as "published" | "draft")}
          >
            <option value="published">Опубликован</option>
            <option value="draft">Черновик</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Обложка</Label>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1">
            <Input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/uploads/имя-файла.jpg"
            />
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 border border-border/40 rounded-md cursor-pointer bg-white/70 hover:bg-white transition-colors">
            <UploadCloud size={16} />
            {uploading ? "Загрузка..." : "Загрузить файл"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFile(file);
              }}
            />
          </label>
        </div>
        {image && (
          <div className="mt-2">
            <img
              src={image}
              alt="cover"
              className="w-full max-w-md rounded-lg border"
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={keepFocus}
            onClick={() => applyCommand("formatBlock", "H2")}
          >
            <Heading2 size={14} className="mr-2" /> Заголовок
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={keepFocus}
            onClick={() => applyCommand("formatBlock", "H3")}
          >
            <Heading3 size={14} className="mr-2" /> Подзаголовок
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={keepFocus}
            onClick={() => applyCommand("bold")}
          >
            <Bold size={14} className="mr-2" /> Жирный
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={keepFocus}
            onClick={() => applyCommand("italic")}
          >
            <Italic size={14} className="mr-2" /> Курсив
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={keepFocus}
            onClick={() => applyCommand("insertUnorderedList")}
          >
            <List size={14} className="mr-2" /> Список
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={keepFocus}
            onClick={() => applyCommand("insertOrderedList")}
          >
            <ListOrdered size={14} className="mr-2" /> Нумерованный
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={keepFocus}
            onClick={() => applyCommand("formatBlock", "BLOCKQUOTE")}
          >
            <Quote size={14} className="mr-2" /> Цитата
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={keepFocus}
            onClick={() => {
              const url = window.prompt("Ссылка");
              if (!url) return;
              applyCommand("createLink", url);
            }}
          >
            <Link2 size={14} className="mr-2" /> Ссылка
          </Button>
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => {
            const html = contentHtml();
            setContentHtmlState(html);
            setReadTime(computeReadTimeFromHtml(html));
          }}
          className="editor-content min-h-[320px] rounded-lg border border-border/40 bg-white/70 p-4 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <p className="text-xs text-muted-foreground">
          Пишите текст как в обычном редакторе. Кнопки сверху помогут сделать
          заголовки и списки.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {onDelete && (
          <Button variant="ghost" className="text-red-600" onClick={onDelete}>
            Удалить
          </Button>
        )}
      </div>

      <SaveBar
        visible={isDirty}
        saving={saving}
        label="Сохранить"
        onSave={handleSave}
      />
    </div>
  );
}
