"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus, Trash2, UploadCloud } from "lucide-react";
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
  CATALOG_CATEGORY_IDS,
  catalogPageContent,
  type CatalogCategoryPageItem,
  type CatalogPageContentData,
} from "@/data/catalog-page-content";
import {
  cloneCatalogPageContent,
  isCatalogPageContent,
} from "@/lib/catalog-page-content";

const CATEGORY_LABELS = Object.fromEntries(
  catalogPageContent.categories.map((item) => [item.id, item.title]),
) as Record<(typeof CATALOG_CATEGORY_IDS)[number], string>;

export default function AdminCatalogContentPage() {
  const [form, setForm] = useState<CatalogPageContentData>(
    cloneCatalogPageContent(catalogPageContent),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openSections, setOpenSections] = useState({
    hero: true,
    categories: true,
    categoryPages: true,
    productPage: true,
  });
  const [openCategoryCards, setOpenCategoryCards] = useState<number[]>(
    catalogPageContent.categories.map((_, index) => index),
  );
  const [openCategoryPages, setOpenCategoryPages] = useState<number[]>(
    catalogPageContent.categoryPages.map((_, index) => index),
  );

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/catalog-content", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (!isCatalogPageContent(data?.item)) return;
        setForm(cloneCatalogPageContent(data.item));
      })
      .catch(() => {
        if (!mounted) return;
        setError("Не удалось загрузить контент каталога.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const categoryOrder = useMemo(
    () =>
      form.categories
        .slice()
        .sort(
          (a, b) =>
            CATALOG_CATEGORY_IDS.indexOf(a.id) -
            CATALOG_CATEGORY_IDS.indexOf(b.id),
        ),
    [form.categories],
  );

  const categoryPagesOrder = useMemo(
    () =>
      form.categoryPages
        .slice()
        .sort(
          (a, b) =>
            CATALOG_CATEGORY_IDS.indexOf(a.id) -
            CATALOG_CATEGORY_IDS.indexOf(b.id),
        ),
    [form.categoryPages],
  );

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCategoryCard = (index: number) => {
    setOpenCategoryCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const toggleCategoryPageCard = (index: number) => {
    setOpenCategoryPages((prev) =>
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

  const handleUpload = async (
    fieldKey: string,
    onSuccess: (url: string) => void,
    file?: File,
  ) => {
    if (!file) return;
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
      onSuccess(result.url);
    } catch {
      setError("Ошибка сети при загрузке файла.");
    } finally {
      setUploadingField(null);
    }
  };

  const updateHero = (
    key: keyof CatalogPageContentData["hero"],
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }));
  };

  const updateCategory = (
    id: (typeof CATALOG_CATEGORY_IDS)[number],
    key: "title" | "description" | "videoPlaceholderColor" | "videoSrc",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const updateCategoryPage = (
    id: (typeof CATALOG_CATEGORY_IDS)[number],
    key: "navTitle" | "headline" | "accentColor",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      categoryPages: prev.categoryPages.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const addSubnavItem = (id: (typeof CATALOG_CATEGORY_IDS)[number]) => {
    setForm((prev) => ({
      ...prev,
      categoryPages: prev.categoryPages.map((item) =>
        item.id === id
          ? {
              ...item,
              subnav: [...item.subnav, { label: "", href: "" }],
            }
          : item,
      ),
    }));
  };

  const updateSubnavItem = (
    id: (typeof CATALOG_CATEGORY_IDS)[number],
    index: number,
    key: "label" | "href",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      categoryPages: prev.categoryPages.map((item) => {
        if (item.id !== id) return item;
        const subnav = [...item.subnav];
        subnav[index] = { ...subnav[index], [key]: value };
        return { ...item, subnav };
      }),
    }));
  };

  const removeSubnavItem = (
    id: (typeof CATALOG_CATEGORY_IDS)[number],
    index: number,
  ) => {
    setForm((prev) => ({
      ...prev,
      categoryPages: prev.categoryPages.map((item) =>
        item.id === id
          ? { ...item, subnav: item.subnav.filter((_, i) => i !== index) }
          : item,
      ),
    }));
  };

  const updateProductPage = (
    key: keyof CatalogPageContentData["productPage"],
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      productPage: { ...prev.productPage, [key]: value },
    }));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    const normalized: CatalogPageContentData = {
      hero: {
        title: form.hero.title.trim(),
        subtitle: form.hero.subtitle.trim(),
      },
      categories: categoryOrder.map((item) => ({
        id: item.id,
        title: item.title.trim(),
        description: item.description.trim(),
        videoPlaceholderColor: item.videoPlaceholderColor.trim(),
        videoSrc: item.videoSrc?.trim() || undefined,
      })),
      categoryPages: categoryPagesOrder.map(
        (item: CatalogCategoryPageItem) => ({
          id: item.id,
          navTitle: item.navTitle.trim(),
          headline: item.headline.trim(),
          accentColor: item.accentColor.trim(),
          subnav: item.subnav
            .map((entry) => ({
              label: entry.label.trim(),
              href: entry.href?.trim() || undefined,
            }))
            .filter((entry) => entry.label),
        }),
      ),
      productPage: {
        backButtonLabel: form.productPage.backButtonLabel.trim(),
        materialsTitle: form.productPage.materialsTitle.trim(),
        materialsDescription: form.productPage.materialsDescription.trim(),
        deliveryTitle: form.productPage.deliveryTitle.trim(),
        deliveryDescription: form.productPage.deliveryDescription.trim(),
      },
    };

    if (!isCatalogPageContent(normalized)) {
      setError("Проверьте заполненность полей контента каталога.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/catalog-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Не удалось сохранить изменения.");
        return;
      }

      setForm(cloneCatalogPageContent(normalized));
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
        title="Каталог: контент страниц"
        description="Редактирование страниц /catalog, /catalog/[category] и статичных блоков карточки товара."
      />

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Hero каталога</CardTitle>
            <CardDescription>
              Заголовок и подзаголовок страницы /catalog.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => toggleSection("hero")}
          >
            {openSections.hero ? "Свернуть" : "Развернуть"}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${openSections.hero ? "rotate-180" : ""}`}
            />
          </Button>
        </CardHeader>
        <Collapsible
          open={openSections.hero}
          onOpenChange={() => toggleSection("hero")}
        >
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Заголовок</Label>
                <Input
                  value={form.hero.title}
                  onChange={(e) => updateHero("title", e.target.value)}
                  className="bg-white/50"
                />
              </div>
              <div className="grid gap-2">
                <Label>Подзаголовок</Label>
                <Input
                  value={form.hero.subtitle}
                  onChange={(e) => updateHero("subtitle", e.target.value)}
                  className="bg-white/50"
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Категории на странице /catalog</CardTitle>
            <CardDescription>
              Тексты и видео категории. Это же видео используется и на
              /catalog/[category].
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => toggleSection("categories")}
          >
            {openSections.categories ? "Свернуть" : "Развернуть"}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${openSections.categories ? "rotate-180" : ""}`}
            />
          </Button>
        </CardHeader>
        <Collapsible
          open={openSections.categories}
          onOpenChange={() => toggleSection("categories")}
        >
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {categoryOrder.map((item, index) => {
                const isOpen = openCategoryCards.includes(index);
                const uploadId = `catalog-category-video-${item.id}`;
                return (
                  <Collapsible
                    key={`catalog-category-${item.id}`}
                    open={isOpen}
                    onOpenChange={() => toggleCategoryCard(index)}
                  >
                    <div className="rounded-xl border border-border/40 bg-white/50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {CATEGORY_LABELS[item.id]} ({item.id})
                        </p>
                        <CollapsibleTrigger asChild>
                          <Button type="button" variant="ghost" size="sm">
                            {isOpen ? "Скрыть" : "Раскрыть"}
                            <ChevronDown
                              className={`ml-2 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="pt-4 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Заголовок</Label>
                            <Input
                              value={item.title}
                              onChange={(e) =>
                                updateCategory(item.id, "title", e.target.value)
                              }
                              className="bg-white/50"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Фон-градиент (tailwind)</Label>
                            <Input
                              value={item.videoPlaceholderColor}
                              onChange={(e) =>
                                updateCategory(
                                  item.id,
                                  "videoPlaceholderColor",
                                  e.target.value,
                                )
                              }
                              className="bg-white/50"
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label>Описание</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) =>
                              updateCategory(
                                item.id,
                                "description",
                                e.target.value,
                              )
                            }
                            className="bg-white/50 min-h-[80px]"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Видео категории (одно поле)</Label>
                          <Input
                            value={item.videoSrc || ""}
                            onChange={(e) =>
                              updateCategory(
                                item.id,
                                "videoSrc",
                                e.target.value,
                              )
                            }
                            className="bg-white/50"
                            placeholder="/videos/category.mp4"
                          />
                          <div className="flex flex-wrap gap-2">
                            <input
                              id={uploadId}
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                void handleUpload(
                                  `upload-${uploadId}`,
                                  (url) =>
                                    updateCategory(item.id, "videoSrc", url),
                                  file,
                                );
                                e.currentTarget.value = "";
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              disabled={uploadingField === `upload-${uploadId}`}
                              onClick={() => triggerFileInput(uploadId)}
                            >
                              <UploadCloud className="mr-2 h-4 w-4" />
                              {uploadingField === `upload-${uploadId}`
                                ? "Загрузка..."
                                : item.videoSrc
                                  ? "Заменить видео"
                                  : "Загрузить видео"}
                            </Button>
                            {item.videoSrc && (
                              <Button
                                type="button"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() =>
                                  updateCategory(item.id, "videoSrc", "")
                                }
                              >
                                Удалить видео
                              </Button>
                            )}
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Страницы категорий /catalog/[category]</CardTitle>
            <CardDescription>
              Заголовки и subnav каждой категории.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => toggleSection("categoryPages")}
          >
            {openSections.categoryPages ? "Свернуть" : "Развернуть"}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${openSections.categoryPages ? "rotate-180" : ""}`}
            />
          </Button>
        </CardHeader>
        <Collapsible
          open={openSections.categoryPages}
          onOpenChange={() => toggleSection("categoryPages")}
        >
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {categoryPagesOrder.map((item, index) => {
                const isOpen = openCategoryPages.includes(index);
                return (
                  <Collapsible
                    key={`catalog-category-page-${item.id}`}
                    open={isOpen}
                    onOpenChange={() => toggleCategoryPageCard(index)}
                  >
                    <div className="rounded-xl border border-border/40 bg-white/50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {CATEGORY_LABELS[item.id]} ({item.id})
                        </p>
                        <CollapsibleTrigger asChild>
                          <Button type="button" variant="ghost" size="sm">
                            {isOpen ? "Скрыть" : "Раскрыть"}
                            <ChevronDown
                              className={`ml-2 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="pt-4 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Малый заголовок</Label>
                            <Input
                              value={item.navTitle}
                              onChange={(e) =>
                                updateCategoryPage(
                                  item.id,
                                  "navTitle",
                                  e.target.value,
                                )
                              }
                              className="bg-white/50"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Цветовой градиент (tailwind)</Label>
                            <Input
                              value={item.accentColor}
                              onChange={(e) =>
                                updateCategoryPage(
                                  item.id,
                                  "accentColor",
                                  e.target.value,
                                )
                              }
                              className="bg-white/50"
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label>Главный заголовок</Label>
                          <Textarea
                            value={item.headline}
                            onChange={(e) =>
                              updateCategoryPage(
                                item.id,
                                "headline",
                                e.target.value,
                              )
                            }
                            className="bg-white/50 min-h-[90px]"
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Ссылки subnav</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addSubnavItem(item.id)}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Добавить ссылку
                            </Button>
                          </div>
                          {item.subnav.map((subnavItem, subnavIndex) => (
                            <div
                              key={`subnav-${item.id}-${subnavIndex}`}
                              className="grid md:grid-cols-[1fr_1fr_auto] gap-2"
                            >
                              <Input
                                value={subnavItem.label}
                                onChange={(e) =>
                                  updateSubnavItem(
                                    item.id,
                                    subnavIndex,
                                    "label",
                                    e.target.value,
                                  )
                                }
                                className="bg-white/50"
                                placeholder="Текст"
                              />
                              <Input
                                value={subnavItem.href || ""}
                                onChange={(e) =>
                                  updateSubnavItem(
                                    item.id,
                                    subnavIndex,
                                    "href",
                                    e.target.value,
                                  )
                                }
                                className="bg-white/50"
                                placeholder="/art-insights/..."
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() =>
                                  removeSubnavItem(item.id, subnavIndex)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
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
            <CardTitle>Страница товара /catalog/[category]/[id]</CardTitle>
            <CardDescription>
              Статичные подписи и тексты внутри карточки товара.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => toggleSection("productPage")}
          >
            {openSections.productPage ? "Свернуть" : "Развернуть"}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${openSections.productPage ? "rotate-180" : ""}`}
            />
          </Button>
        </CardHeader>
        <Collapsible
          open={openSections.productPage}
          onOpenChange={() => toggleSection("productPage")}
        >
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Текст кнопки «назад»</Label>
                <Input
                  value={form.productPage.backButtonLabel}
                  onChange={(e) =>
                    updateProductPage("backButtonLabel", e.target.value)
                  }
                  className="bg-white/50"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Заголовок блока «Материалы»</Label>
                  <Input
                    value={form.productPage.materialsTitle}
                    onChange={(e) =>
                      updateProductPage("materialsTitle", e.target.value)
                    }
                    className="bg-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Заголовок блока «Доставка»</Label>
                  <Input
                    value={form.productPage.deliveryTitle}
                    onChange={(e) =>
                      updateProductPage("deliveryTitle", e.target.value)
                    }
                    className="bg-white/50"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Описание «Материалы»</Label>
                  <Textarea
                    value={form.productPage.materialsDescription}
                    onChange={(e) =>
                      updateProductPage("materialsDescription", e.target.value)
                    }
                    className="bg-white/50 min-h-[110px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Описание «Доставка»</Label>
                  <Textarea
                    value={form.productPage.deliveryDescription}
                    onChange={(e) =>
                      updateProductPage("deliveryDescription", e.target.value)
                    }
                    className="bg-white/50 min-h-[110px]"
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
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
