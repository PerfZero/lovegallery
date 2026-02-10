"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { slugify } from "@/lib/blog-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Sparkles,
  UploadCloud,
  ImagePlus,
  Tag,
  Layers,
  Trash2,
  X,
} from "lucide-react";

type AspectRatio = "portrait" | "square" | "landscape";
type CatalogStatus = "active" | "draft" | "archived";

export type CatalogOptions = {
  sizes: string[];
  finishes: string[];
  fabrics: string[];
};

export type CatalogEditorValue = {
  slug: string;
  category: string;
  title: string;
  artist: string;
  price: string;
  image: string;
  videoSrc: string;
  images: string[];
  aspectRatio: AspectRatio;
  tags: string[];
  description: string;
  isNew: boolean;
  status: CatalogStatus;
  sortOrder: number;
  options: CatalogOptions;
};

export type CatalogEditorPayload = {
  slug: string;
  category: string;
  title: string;
  artist: string;
  price: string;
  image: string;
  videoSrc: string;
  images: string[];
  aspectRatio: AspectRatio;
  tags: string[];
  description: string;
  isNew: boolean;
  status: CatalogStatus;
  sortOrder: number;
  options: Partial<CatalogOptions>;
};

const EMPTY_VALUE: CatalogEditorValue = {
  slug: "",
  category: "painting",
  title: "",
  artist: "",
  price: "",
  image: "",
  videoSrc: "",
  images: [],
  aspectRatio: "square",
  tags: [],
  description: "",
  isNew: false,
  status: "active",
  sortOrder: 0,
  options: {
    sizes: [],
    finishes: [],
    fabrics: [],
  },
};

const CATEGORY_OPTIONS = [
  { value: "painting", label: "Живопись" },
  { value: "photo", label: "Фото" },
  { value: "textile", label: "Текстиль" },
  { value: "pet-furniture", label: "Мебель для животных" },
  { value: "collections", label: "Коллекции" },
];

function toInitialValue(
  initial?: Partial<CatalogEditorValue>,
): CatalogEditorValue {
  return {
    ...EMPTY_VALUE,
    ...initial,
    images: initial?.images || [],
    tags: initial?.tags || [],
    options: {
      sizes: initial?.options?.sizes || [],
      finishes: initial?.options?.finishes || [],
      fabrics: initial?.options?.fabrics || [],
    },
  };
}

function splitByComma(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function ArrayField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  const addValue = () => {
    const toAdd = splitByComma(draft);
    if (toAdd.length === 0) return;
    const next = Array.from(new Set([...value, ...toAdd]));
    onChange(next);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addValue();
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" onClick={addValue}>
          Добавить
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-secondary/40 px-3 py-1 text-xs"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x !== item))}
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Удалить ${item}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function CatalogEditor({
  initial,
  onSave,
  onDelete,
}: {
  initial?: Partial<CatalogEditorValue>;
  onSave: (payload: CatalogEditorPayload) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const initialValue = useMemo(() => toInitialValue(initial), [initial]);
  const [form, setForm] = useState<CatalogEditorValue>(initialValue);
  const [saving, setSaving] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValue.slug));
  const mainUploadRef = useRef<HTMLInputElement | null>(null);
  const galleryUploadRef = useRef<HTMLInputElement | null>(null);

  const isEdit = Boolean(initial?.slug);
  const categoryLabel =
    CATEGORY_OPTIONS.find((option) => option.value === form.category)?.label ||
    form.category;

  const update = <K extends keyof CatalogEditorValue>(
    key: K,
    value: CatalogEditorValue[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateOption = (key: keyof CatalogOptions, value: string[]) => {
    setForm((prev) => ({
      ...prev,
      options: { ...prev.options, [key]: value },
    }));
  };

  const handleTitleChange = (value: string) => {
    setForm((prev) => {
      const next: CatalogEditorValue = { ...prev, title: value };
      if (!slugTouched) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const uploadSingleFile = async (
    file: File,
  ): Promise<{ url: string | null; error: string | null }> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: fd,
      credentials: "include",
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        return { url: null, error: data.error || "Ошибка загрузки файла." };
      }
      return {
        url: data.url || null,
        error: data.url ? null : "Сервер не вернул ссылку на файл.",
      };
    }

    if (!res.ok) {
      return { url: null, error: `Ошибка загрузки: ${res.status}` };
    }

    return { url: null, error: "Некорректный ответ сервера при загрузке." };
  };

  const appendGalleryUrls = (urls: string[]) => {
    if (urls.length === 0) return;
    setForm((prev) => ({
      ...prev,
      images: Array.from(new Set([...prev.images, ...urls])),
    }));
  };

  const handleMainUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploadingMain(true);
    setError("");
    try {
      const result = await uploadSingleFile(file);
      if (result.error) {
        setError(result.error);
        return;
      }
      const url = result.url;
      if (!url) {
        setError("Не удалось загрузить главное изображение.");
        return;
      }
      update("image", url);
    } catch {
      setError("Ошибка при загрузке изображения.");
    } finally {
      setUploadingMain(false);
    }
  };

  const handleGalleryUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : [];
    event.target.value = "";
    if (selectedFiles.length === 0) return;
    setUploadingGallery(true);
    setError("");
    try {
      const urls: string[] = [];
      const failed: string[] = [];
      for (const file of selectedFiles) {
        const result = await uploadSingleFile(file);
        if (result.url) urls.push(result.url);
        if (result.error) failed.push(`${file.name}: ${result.error}`);
      }
      appendGalleryUrls(urls);
      if (failed.length > 0) {
        setError(`Часть файлов не загружена. ${failed[0]}`);
      } else if (urls.length === 0) {
        setError("Не удалось загрузить изображения галереи.");
      }
    } catch {
      setError("Ошибка при загрузке изображений.");
    } finally {
      setUploadingGallery(false);
    }
  };

  const validate = () => {
    if (!form.title.trim()) return "Укажите название товара.";
    if (!form.slug.trim()) return "Укажите ID товара.";
    if (!form.price.trim()) return "Укажите цену.";
    if (!form.image.trim()) return "Добавьте главное изображение.";
    return "";
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload: CatalogEditorPayload = {
      slug: form.slug.trim(),
      category: form.category,
      title: form.title.trim(),
      artist: form.artist.trim(),
      price: form.price.trim(),
      image: form.image.trim(),
      videoSrc: form.videoSrc.trim(),
      images: form.images,
      aspectRatio: form.aspectRatio,
      tags: form.tags,
      description: form.description.trim(),
      isNew: form.isNew,
      status: form.status,
      sortOrder: form.sortOrder,
      options: {
        ...(form.options.sizes.length > 0 ? { sizes: form.options.sizes } : {}),
        ...(form.options.finishes.length > 0
          ? { finishes: form.options.finishes }
          : {}),
        ...(form.options.fabrics.length > 0
          ? { fabrics: form.options.fabrics }
          : {}),
      },
    };

    setSaving(true);
    setError("");
    try {
      await onSave(payload);
    } catch {
      setError("Не удалось сохранить товар. Попробуйте еще раз.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-16">
      <div className="xl:col-span-8 space-y-6">
        <Card className="border-border/40 bg-white/70 backdrop-blur-sm">
          <CardHeader className="space-y-3">
            <CardTitle className="text-xl font-display italic">
              {isEdit ? "Редактирование товара" : "Новый товар"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Заполните блоки по порядку. Все поля подписаны простым языком.
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="main" className="space-y-5">
              <TabsList>
                <TabsTrigger value="main">Основное</TabsTrigger>
                <TabsTrigger value="media">Медиа</TabsTrigger>
                <TabsTrigger value="details">Параметры</TabsTrigger>
              </TabsList>

              <TabsContent value="main" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Название товара</Label>
                    <Input
                      value={form.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Например: Коллекция ШАНТАРАМ"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Категория</Label>
                    <Select
                      value={form.category}
                      onValueChange={(value) => update("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Цена</Label>
                    <Input
                      value={form.price}
                      onChange={(e) => update("price", e.target.value)}
                      placeholder="Например: 120 000 ₽"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Статус карточки</Label>
                    <Select
                      value={form.status}
                      onValueChange={(value) =>
                        update("status", value as CatalogStatus)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          Показывать на сайте
                        </SelectItem>
                        <SelectItem value="draft">Черновик</SelectItem>
                        <SelectItem value="archived">Архив</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Порядок в списке</Label>
                    <Input
                      type="number"
                      value={form.sortOrder}
                      onChange={(e) =>
                        update("sortOrder", Number(e.target.value) || 0)
                      }
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Краткое описание</Label>
                    <Textarea
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      placeholder="Простой текст, который увидит клиент на карточке товара."
                    />
                  </div>

                  <div className="flex items-center gap-3 md:col-span-2 pt-1">
                    <Checkbox
                      id="is-new-item"
                      checked={form.isNew}
                      onCheckedChange={(checked) =>
                        update("isNew", checked === true)
                      }
                    />
                    <Label htmlFor="is-new-item">Пометить как «Новинка»</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="space-y-2">
                  <Label>Главное изображение</Label>
                  <div className="space-y-3">
                    <div className="relative h-56 w-full overflow-hidden rounded-md border border-border/40 bg-secondary/40">
                      {form.image ? (
                        <Image
                          src={form.image}
                          alt={form.title || "main-image"}
                          fill
                          sizes="920px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-sm text-muted-foreground">
                          Загрузите главное фото
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <input
                        ref={mainUploadRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleMainUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => mainUploadRef.current?.click()}
                        disabled={uploadingMain}
                      >
                        <UploadCloud size={16} />
                        {uploadingMain
                          ? "Загрузка..."
                          : form.image
                            ? "Заменить фото"
                            : "Загрузить фото"}
                      </Button>
                      {form.image && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => update("image", "")}
                        >
                          Удалить фото
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Видео (необязательно)</Label>
                  <Input
                    value={form.videoSrc}
                    onChange={(e) => update("videoSrc", e.target.value)}
                    placeholder="/videos/..."
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Галерея изображений</Label>
                    <input
                      ref={galleryUploadRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleGalleryUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => galleryUploadRef.current?.click()}
                      disabled={uploadingGallery}
                    >
                      <ImagePlus size={16} />
                      {uploadingGallery ? "Загрузка..." : "Добавить файлы"}
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {form.images.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Доп. изображений пока нет.
                      </p>
                    )}
                    {form.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {form.images.map((url) => (
                          <div
                            key={url}
                            className="group relative aspect-square overflow-hidden rounded-md border border-border/40 bg-secondary/30"
                          >
                            <Image
                              src={url}
                              alt={form.title || "gallery-image"}
                              fill
                              sizes="300px"
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                update(
                                  "images",
                                  form.images.filter((item) => item !== url),
                                )
                              }
                              className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/55 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Удалить изображение"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {form.images.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => update("images", [])}
                      >
                        Очистить галерею
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label>ID товара (используется в ссылке)</Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSlugTouched(true);
                          update("slug", slugify(form.title));
                        }}
                      >
                        <Sparkles size={14} />
                        Сгенерировать из названия
                      </Button>
                    </div>
                    <Input
                      value={form.slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        update("slug", e.target.value);
                      }}
                      placeholder="unikalnyy-id-tovara"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Автор</Label>
                    <Input
                      value={form.artist}
                      onChange={(e) => update("artist", e.target.value)}
                      placeholder="Например: Авторский проект галереи"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Формат изображения</Label>
                    <Select
                      value={form.aspectRatio}
                      onValueChange={(value) =>
                        update("aspectRatio", value as AspectRatio)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Формат" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Портретный</SelectItem>
                        <SelectItem value="square">Квадратный</SelectItem>
                        <SelectItem value="landscape">Альбомный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <ArrayField
                    label="Теги"
                    value={form.tags}
                    onChange={(next) => update("tags", next)}
                    placeholder="Введите тег и нажмите Enter"
                  />

                  <ArrayField
                    label="Размеры"
                    value={form.options.sizes}
                    onChange={(next) => updateOption("sizes", next)}
                    placeholder="Например: 50*70"
                  />

                  <ArrayField
                    label="Отделки"
                    value={form.options.finishes}
                    onChange={(next) => updateOption("finishes", next)}
                    placeholder="Например: Дуб"
                  />

                  <ArrayField
                    label="Ткани"
                    value={form.options.fabrics}
                    onChange={(next) => updateOption("fabrics", next)}
                    placeholder="Например: Ткань 1"
                  />
                </div>
              </TabsContent>
            </Tabs>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving
                  ? "Сохранение..."
                  : isEdit
                    ? "Сохранить изменения"
                    : "Создать товар"}
              </Button>
              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-red-600">
                      <Trash2 size={16} />
                      Удалить товар
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Действие необратимо. Карточка будет удалена из каталога.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={async () => {
                          try {
                            await onDelete();
                          } catch {
                            setError("Не удалось удалить товар.");
                          }
                        }}
                      >
                        Удалить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-4">
        <Card className="border-border/40 bg-white/70 backdrop-blur-sm sticky top-24">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers size={16} />
              Предпросмотр карточки
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Так карточка будет восприниматься в админке.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative h-48 w-full overflow-hidden rounded-md border border-border/30 bg-secondary/40">
              {form.image ? (
                <Image
                  src={form.image}
                  alt={form.title || "preview"}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full grid place-items-center text-xs text-muted-foreground">
                  Добавьте главное изображение
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Категория</p>
              <p className="font-medium">{categoryLabel}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Название</p>
              <p className="font-medium">{form.title || "Без названия"}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Цена</p>
              <p className="font-medium">{form.price || "Не указана"}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-secondary/40 px-2.5 py-1 text-xs">
                <Tag size={12} />
                {form.status === "active"
                  ? "Показывается"
                  : form.status === "draft"
                    ? "Черновик"
                    : "Архив"}
              </span>
              {form.isNew && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs text-amber-800">
                  <Sparkles size={12} />
                  Новинка
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
