"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  aboutContent,
  type AboutAlphabetItem,
  type AboutCategoryContent,
  type AboutContent,
} from "@/data/about-content";
import { cloneAboutContent, isAboutContent } from "@/lib/about-content";

function makeEmptyCategory(): AboutCategoryContent {
  return {
    title: "",
    image: "",
    description: "",
    href: "",
  };
}

function makeEmptyAlphabetItem(): AboutAlphabetItem {
  return {
    letter: "",
    title: "",
    image: "",
    video: "",
    caption: "",
    captionLinkLabel: "",
    captionLinkHref: "",
    description: "",
  };
}

export default function AdminAboutPage() {
  const [form, setForm] = useState<AboutContent>(
    cloneAboutContent(aboutContent),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [categoriesSectionOpen, setCategoriesSectionOpen] = useState(true);
  const [alphabetSectionOpen, setAlphabetSectionOpen] = useState(true);
  const [openCategories, setOpenCategories] = useState<number[]>([]);
  const [openAlphabetItems, setOpenAlphabetItems] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/about", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const incoming = data?.item;
        if (!isAboutContent(incoming)) return;
        setForm(cloneAboutContent(incoming));
      })
      .catch(() => {
        if (!mounted) return;
        setError("Не удалось загрузить контент страницы «О нас».");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const updateHero = (
    key: "subtitle" | "title" | "description",
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }));
  };

  const updateOutro = (
    key:
      | "letter"
      | "title"
      | "headlinePrimary"
      | "headlineSecondary"
      | "description"
      | "footerText",
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, outro: { ...prev.outro, [key]: value } }));
  };

  const updateCategory = (
    index: number,
    key: keyof AboutCategoryContent,
    value: string,
  ) => {
    setForm((prev) => {
      const next = [...prev.categories];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, categories: next };
    });
  };

  const addCategory = () => {
    const nextIndex = form.categories.length;
    setForm((prev) => ({
      ...prev,
      categories: [...prev.categories, makeEmptyCategory()],
    }));
    setOpenCategories((prev) =>
      prev.includes(nextIndex) ? prev : [...prev, nextIndex],
    );
  };

  const removeCategory = (index: number) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
    setOpenCategories((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const updateAlphabet = (
    index: number,
    key: keyof AboutAlphabetItem,
    value: string,
  ) => {
    setForm((prev) => {
      const next = [...prev.alphabet];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, alphabet: next };
    });
  };

  const addAlphabetItem = () => {
    const nextIndex = form.alphabet.length;
    setForm((prev) => ({
      ...prev,
      alphabet: [...prev.alphabet, makeEmptyAlphabetItem()],
    }));
    setOpenAlphabetItems((prev) =>
      prev.includes(nextIndex) ? prev : [...prev, nextIndex],
    );
  };

  const removeAlphabetItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      alphabet: prev.alphabet.filter((_, i) => i !== index),
    }));
    setOpenAlphabetItems((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const toggleCategoryOpen = (index: number) => {
    setOpenCategories((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const toggleAlphabetOpen = (index: number) => {
    setOpenAlphabetItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const triggerFileInput = (id: string) => {
    const input = document.getElementById(id) as HTMLInputElement | null;
    input?.click();
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

  const handleCategoryImageUpload = async (index: number, file?: File) => {
    if (!file) return;
    const fieldKey = `category-image-${index}`;
    setUploadingField(fieldKey);
    setError("");
    setSuccess("");
    try {
      const result = await uploadSingleFile(file);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (!result.url) {
        setError("Не удалось получить URL загруженного файла.");
        return;
      }
      updateCategory(index, "image", result.url);
    } catch {
      setError("Ошибка сети при загрузке изображения.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleAlphabetImageUpload = async (index: number, file?: File) => {
    if (!file) return;
    const fieldKey = `alphabet-image-${index}`;
    setUploadingField(fieldKey);
    setError("");
    setSuccess("");
    try {
      const result = await uploadSingleFile(file);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (!result.url) {
        setError("Не удалось получить URL загруженного файла.");
        return;
      }
      updateAlphabet(index, "image", result.url);
    } catch {
      setError("Ошибка сети при загрузке изображения.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleAlphabetVideoUpload = async (index: number, file?: File) => {
    if (!file) return;
    const fieldKey = `alphabet-video-${index}`;
    setUploadingField(fieldKey);
    setError("");
    setSuccess("");
    try {
      const result = await uploadSingleFile(file);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (!result.url) {
        setError("Не удалось получить URL загруженного файла.");
        return;
      }
      updateAlphabet(index, "video", result.url);
    } catch {
      setError("Ошибка сети при загрузке видео.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    const normalized: AboutContent = {
      ...form,
      categories: form.categories.map((item) => ({
        ...item,
        href: item.href?.trim() || undefined,
      })),
      alphabet: form.alphabet.map((item) => ({
        ...item,
        video: item.video?.trim() || undefined,
        caption: item.caption?.trim() || undefined,
        captionLinkLabel: item.captionLinkLabel?.trim() || undefined,
        captionLinkHref: item.captionLinkHref?.trim() || undefined,
      })),
    };

    if (!isAboutContent(normalized)) {
      setError(
        "Проверьте обязательные поля: заголовки, описания, буквы и изображения.",
      );
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(data.error || "Не удалось сохранить изменения.");
        return;
      }

      setForm(cloneAboutContent(normalized));
      setSuccess("Изменения сохранены.");
    } catch {
      setError("Ошибка сети при сохранении.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  }

  return (
    <div className="space-y-8 pb-20 max-w-6xl">
      <AdminPageHeader
        title="Страница «О нас»"
        description="Редактирование контента публичной страницы /about."
      />

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle>Hero</CardTitle>
          <CardDescription>
            Верхний блок страницы: заголовки и короткое описание.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="hero-subtitle">Подзаголовок</Label>
            <Input
              id="hero-subtitle"
              value={form.hero.subtitle}
              onChange={(e) => updateHero("subtitle", e.target.value)}
              className="bg-white/40"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hero-title">Заголовок</Label>
            <Input
              id="hero-title"
              value={form.hero.title}
              onChange={(e) => updateHero("title", e.target.value)}
              className="bg-white/40"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hero-description">Описание</Label>
            <Textarea
              id="hero-description"
              value={form.hero.description}
              onChange={(e) => updateHero("description", e.target.value)}
              className="bg-white/40 min-h-[110px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Категории</CardTitle>
            <CardDescription>
              Карточки верхнего грида страницы «О нас».
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={addCategory}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить категорию
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCategoriesSectionOpen((prev) => !prev)}
            >
              {categoriesSectionOpen ? "Свернуть" : "Развернуть"}
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform ${categoriesSectionOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
        <Collapsible
          open={categoriesSectionOpen}
          onOpenChange={setCategoriesSectionOpen}
        >
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {form.categories.map((item, index) => {
                const isOpen = openCategories.includes(index);
                return (
                  <Collapsible
                    key={`category-${index}`}
                    open={isOpen}
                    onOpenChange={() => toggleCategoryOpen(index)}
                  >
                    <div className="rounded-xl border border-border/40 bg-white/50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          Категория {index + 1}: {item.title || "Без названия"}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeCategory(index)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button type="button" variant="ghost" size="sm">
                              {isOpen ? "Скрыть" : "Раскрыть"}
                              <ChevronDown
                                className={`ml-2 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                              />
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </div>

                      <CollapsibleContent className="pt-4 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Заголовок</Label>
                            <Input
                              value={item.title}
                              onChange={(e) =>
                                updateCategory(index, "title", e.target.value)
                              }
                              className="bg-white/50"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Ссылка (href)</Label>
                            <Input
                              value={item.href || ""}
                              onChange={(e) =>
                                updateCategory(index, "href", e.target.value)
                              }
                              placeholder="/catalog"
                              className="bg-white/50"
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label>Картинка</Label>
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative w-full md:w-56 h-32 rounded-lg border border-border/40 bg-secondary/30 overflow-hidden">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.title || `Категория ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                                  Нет изображения
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <input
                                id={`category-image-input-${index}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  void handleCategoryImageUpload(index, file);
                                  e.currentTarget.value = "";
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                disabled={
                                  uploadingField === `category-image-${index}`
                                }
                                onClick={() =>
                                  triggerFileInput(
                                    `category-image-input-${index}`,
                                  )
                                }
                              >
                                {uploadingField === `category-image-${index}`
                                  ? "Загрузка..."
                                  : item.image
                                    ? "Заменить фото"
                                    : "Загрузить фото"}
                              </Button>
                              {item.image && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() =>
                                    updateCategory(index, "image", "")
                                  }
                                >
                                  Удалить фото
                                </Button>
                              )}
                              {item.image && (
                                <p className="text-[11px] text-muted-foreground break-all max-w-[320px]">
                                  {item.image}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label>Описание</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) =>
                              updateCategory(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            className="bg-white/50 min-h-[90px]"
                          />
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Алфавит</CardTitle>
            <CardDescription>
              Блоки «А, Б, В...» с медиа, описанием и ссылками в подписи.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={addAlphabetItem}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить пункт
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setAlphabetSectionOpen((prev) => !prev)}
            >
              {alphabetSectionOpen ? "Свернуть" : "Развернуть"}
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform ${alphabetSectionOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
        <Collapsible
          open={alphabetSectionOpen}
          onOpenChange={setAlphabetSectionOpen}
        >
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {form.alphabet.map((item, index) => {
                const isOpen = openAlphabetItems.includes(index);
                return (
                  <Collapsible
                    key={`alphabet-${index}`}
                    open={isOpen}
                    onOpenChange={() => toggleAlphabetOpen(index)}
                  >
                    <div className="rounded-xl border border-border/40 bg-white/50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          Пункт {index + 1}: {item.letter || "?"}{" "}
                          {item.title || "Без названия"}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeAlphabetItem(index)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button type="button" variant="ghost" size="sm">
                              {isOpen ? "Скрыть" : "Раскрыть"}
                              <ChevronDown
                                className={`ml-2 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                              />
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </div>

                      <CollapsibleContent className="pt-4 space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="grid gap-2">
                            <Label>Буква</Label>
                            <Input
                              value={item.letter}
                              onChange={(e) =>
                                updateAlphabet(index, "letter", e.target.value)
                              }
                              className="bg-white/50"
                            />
                          </div>
                          <div className="grid gap-2 md:col-span-2">
                            <Label>Заголовок</Label>
                            <Input
                              value={item.title}
                              onChange={(e) =>
                                updateAlphabet(index, "title", e.target.value)
                              }
                              className="bg-white/50"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Картинка</Label>
                            <div className="flex flex-col gap-3">
                              <div className="relative w-full h-36 rounded-lg border border-border/40 bg-secondary/30 overflow-hidden">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.title || `Пункт ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                                    Нет изображения
                                  </div>
                                )}
                              </div>
                              <input
                                id={`alphabet-image-input-${index}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  void handleAlphabetImageUpload(index, file);
                                  e.currentTarget.value = "";
                                }}
                              />
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={
                                    uploadingField === `alphabet-image-${index}`
                                  }
                                  onClick={() =>
                                    triggerFileInput(
                                      `alphabet-image-input-${index}`,
                                    )
                                  }
                                >
                                  {uploadingField === `alphabet-image-${index}`
                                    ? "Загрузка..."
                                    : item.image
                                      ? "Заменить фото"
                                      : "Загрузить фото"}
                                </Button>
                                {item.image && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() =>
                                      updateAlphabet(index, "image", "")
                                    }
                                  >
                                    Удалить фото
                                  </Button>
                                )}
                              </div>
                              {item.image && (
                                <p className="text-[11px] text-muted-foreground break-all">
                                  {item.image}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label>Видео</Label>
                            <div className="flex flex-col gap-3">
                              <div className="relative w-full h-36 rounded-lg border border-border/40 bg-secondary/30 overflow-hidden">
                                {item.video ? (
                                  <video
                                    src={item.video}
                                    controls
                                    preload="metadata"
                                    className="h-full w-full object-cover bg-black"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                                    Нет видео
                                  </div>
                                )}
                              </div>
                              <input
                                id={`alphabet-video-input-${index}`}
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  void handleAlphabetVideoUpload(index, file);
                                  e.currentTarget.value = "";
                                }}
                              />
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={
                                    uploadingField === `alphabet-video-${index}`
                                  }
                                  onClick={() =>
                                    triggerFileInput(
                                      `alphabet-video-input-${index}`,
                                    )
                                  }
                                >
                                  {uploadingField === `alphabet-video-${index}`
                                    ? "Загрузка..."
                                    : item.video
                                      ? "Заменить видео"
                                      : "Загрузить видео"}
                                </Button>
                                {item.video && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() =>
                                      updateAlphabet(index, "video", "")
                                    }
                                  >
                                    Удалить видео
                                  </Button>
                                )}
                              </div>
                              {item.video && (
                                <p className="text-[11px] text-muted-foreground break-all">
                                  {item.video}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label>Описание</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) =>
                              updateAlphabet(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            className="bg-white/50 min-h-[110px]"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label>Подпись под медиа (caption)</Label>
                          <Textarea
                            value={item.caption || ""}
                            onChange={(e) =>
                              updateAlphabet(index, "caption", e.target.value)
                            }
                            className="bg-white/50 min-h-[90px]"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Текст ссылки в подписи (опционально)</Label>
                            <Input
                              value={item.captionLinkLabel || ""}
                              onChange={(e) =>
                                updateAlphabet(
                                  index,
                                  "captionLinkLabel",
                                  e.target.value,
                                )
                              }
                              placeholder="ШАНТАРАМ"
                              className="bg-white/50"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>URL ссылки в подписи (опционально)</Label>
                            <Input
                              value={item.captionLinkHref || ""}
                              onChange={(e) =>
                                updateAlphabet(
                                  index,
                                  "captionLinkHref",
                                  e.target.value,
                                )
                              }
                              placeholder="/catalog/collections"
                              className="bg-white/50"
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle>Финальный блок</CardTitle>
          <CardDescription>
            Последняя секция страницы: буква, описание и подпись внизу.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="outro-letter">Буква</Label>
              <Input
                id="outro-letter"
                value={form.outro.letter}
                onChange={(e) => updateOutro("letter", e.target.value)}
                className="bg-white/40"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="outro-title">Заголовок</Label>
              <Input
                id="outro-title"
                value={form.outro.title}
                onChange={(e) => updateOutro("title", e.target.value)}
                className="bg-white/40"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="outro-headline-primary">Заголовок 1</Label>
            <Input
              id="outro-headline-primary"
              value={form.outro.headlinePrimary || ""}
              onChange={(e) => updateOutro("headlinePrimary", e.target.value)}
              className="bg-white/40"
              placeholder="Искусство требует."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="outro-headline-secondary">Заголовок 2</Label>
            <Input
              id="outro-headline-secondary"
              value={form.outro.headlineSecondary || ""}
              onChange={(e) => updateOutro("headlineSecondary", e.target.value)}
              className="bg-white/40"
              placeholder="Заботу мы берём на себя."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="outro-description">Описание</Label>
            <Textarea
              id="outro-description"
              value={form.outro.description}
              onChange={(e) => updateOutro("description", e.target.value)}
              className="bg-white/40 min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="outro-footer">Нижний текст</Label>
            <Textarea
              id="outro-footer"
              value={form.outro.footerText}
              onChange={(e) => updateOutro("footerText", e.target.value)}
              className="bg-white/40 min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </div>
    </div>
  );
}
