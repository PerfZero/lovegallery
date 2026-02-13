"use client";

import { useEffect, useMemo, useState } from "react";
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
import { SaveBar } from "@/components/admin/save-bar";
import { toast } from "@/components/ui/sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  faqContent,
  type FAQContentData,
  type FAQItem,
} from "@/data/faq-content";
import { cloneFAQContent, isFAQContent } from "@/lib/faq-content";

function makeEmptyItem(category: string): FAQItem {
  return {
    category,
    question: "",
    answer: "",
  };
}

function dedupe(values: string[]): string[] {
  return Array.from(new Set(values));
}

function normalizeFAQContent(form: FAQContentData): FAQContentData {
  const rawCategories = form.categories
    .map((item) => item.trim())
    .filter(Boolean);
  const fallbackCategory = rawCategories[0] || "Общее";

  const normalizedItems = form.items
    .map((item) => ({
      category: item.category.trim() || fallbackCategory,
      question: item.question.trim(),
      answer: item.answer.trim(),
    }))
    .filter((item) => item.question && item.answer);

  const categories =
    rawCategories.length > 0
      ? dedupe(rawCategories)
      : dedupe(normalizedItems.map((item) => item.category).filter(Boolean));

  return {
    hero: {
      badge: form.hero.badge.trim(),
      titlePrimary: form.hero.titlePrimary.trim(),
      titleAccent: form.hero.titleAccent.trim(),
      description: form.hero.description.trim(),
    },
    categories: categories.length > 0 ? categories : ["Общее"],
    items: normalizedItems,
    cta: {
      title: form.cta.title.trim(),
      description: form.cta.description.trim(),
      buttonLabel: form.cta.buttonLabel.trim(),
      buttonHref: form.cta.buttonHref.trim(),
    },
  };
}

export default function AdminFAQPage() {
  const [form, setForm] = useState<FAQContentData>(cloneFAQContent(faqContent));
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(normalizeFAQContent(cloneFAQContent(faqContent))),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openSections, setOpenSections] = useState({
    hero: true,
    categories: true,
    items: true,
    cta: true,
  });
  const [openItems, setOpenItems] = useState<number[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/faq", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (!isFAQContent(data?.item)) return;
        const nextForm = cloneFAQContent(data.item);
        setForm(nextForm);
        setSavedSnapshot(JSON.stringify(normalizeFAQContent(nextForm)));
      })
      .catch(() => {
        if (!mounted) return;
        setError("Не удалось загрузить контент страницы FAQ.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleItemOpen = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const updateHero = (key: keyof FAQContentData["hero"], value: string) => {
    setForm((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }));
  };

  const updateCta = (key: keyof FAQContentData["cta"], value: string) => {
    setForm((prev) => ({ ...prev, cta: { ...prev.cta, [key]: value } }));
  };

  const updateCategory = (index: number, value: string) => {
    setForm((prev) => {
      const categories = [...prev.categories];
      categories[index] = value;
      return { ...prev, categories };
    });
  };

  const addCategory = () => {
    setForm((prev) => ({ ...prev, categories: [...prev.categories, ""] }));
  };

  const removeCategory = (index: number) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index: number, key: keyof FAQItem, value: string) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [key]: value };
      return { ...prev, items };
    });
  };

  const addItem = () => {
    const nextIndex = form.items.length;
    const fallbackCategory = form.categories[0]?.trim() || "Общее";
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, makeEmptyItem(fallbackCategory)],
    }));
    setOpenItems((prev) =>
      prev.includes(nextIndex) ? prev : [...prev, nextIndex],
    );
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    setOpenItems((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    const normalized = normalizeFAQContent(form);

    if (!isFAQContent(normalized)) {
      setError("Проверьте заполненность полей FAQ.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/faq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Не удалось сохранить изменения.");
        return;
      }

      setForm(cloneFAQContent(normalized));
      setSavedSnapshot(JSON.stringify(normalized));
      setSuccess("Изменения сохранены.");
      toast.success("Изменения сохранены");
    } catch {
      setError("Ошибка сети при сохранении.");
    } finally {
      setSaving(false);
    }
  };

  const normalizedForm = useMemo(() => normalizeFAQContent(form), [form]);
  const isDirty = JSON.stringify(normalizedForm) !== savedSnapshot;

  if (loading) {
    return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  }

  return (
    <div className="space-y-8 pb-20 max-w-6xl">
      <AdminPageHeader
        title="Страница FAQ"
        description="Редактирование контента публичной страницы /faq."
      />

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Hero</CardTitle>
            <CardDescription>Верхний блок страницы FAQ.</CardDescription>
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
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Бейдж</Label>
                  <Input
                    value={form.hero.badge}
                    onChange={(e) => updateHero("badge", e.target.value)}
                    className="bg-white/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Заголовок (акцент)</Label>
                  <Input
                    value={form.hero.titleAccent}
                    onChange={(e) => updateHero("titleAccent", e.target.value)}
                    className="bg-white/50"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Заголовок (основной)</Label>
                <Input
                  value={form.hero.titlePrimary}
                  onChange={(e) => updateHero("titlePrimary", e.target.value)}
                  className="bg-white/50"
                />
              </div>
              <div className="grid gap-2">
                <Label>Описание</Label>
                <Textarea
                  value={form.hero.description}
                  onChange={(e) => updateHero("description", e.target.value)}
                  className="bg-white/50 min-h-[100px]"
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Категории</CardTitle>
            <CardDescription>
              Кнопки фильтра над списком вопросов.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={addCategory}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить
            </Button>
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
          </div>
        </CardHeader>
        <Collapsible
          open={openSections.categories}
          onOpenChange={() => toggleSection("categories")}
        >
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {form.categories.map((category, index) => (
                <div key={`faq-category-${index}`} className="flex gap-2">
                  <Input
                    value={category}
                    onChange={(e) => updateCategory(index, e.target.value)}
                    className="bg-white/50"
                    placeholder={`Категория ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeCategory(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Вопросы и ответы</CardTitle>
            <CardDescription>Основной список FAQ.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить вопрос
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => toggleSection("items")}
            >
              {openSections.items ? "Свернуть" : "Развернуть"}
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform ${openSections.items ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
        <Collapsible
          open={openSections.items}
          onOpenChange={() => toggleSection("items")}
        >
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <datalist id="faq-categories-list">
                {form.categories.filter(Boolean).map((category, index) => (
                  <option
                    key={`faq-category-option-${index}`}
                    value={category}
                  />
                ))}
              </datalist>
              {form.items.map((item, index) => {
                const isOpen = openItems.includes(index);
                return (
                  <Collapsible
                    key={`faq-item-${index}`}
                    open={isOpen}
                    onOpenChange={() => toggleItemOpen(index)}
                  >
                    <div className="rounded-xl border border-border/40 bg-white/50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium line-clamp-1">
                          {index + 1}. {item.question || "Без вопроса"}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeItem(index)}
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
                        <div className="grid gap-2">
                          <Label>Категория</Label>
                          <Input
                            value={item.category}
                            list="faq-categories-list"
                            onChange={(e) =>
                              updateItem(index, "category", e.target.value)
                            }
                            className="bg-white/50"
                            placeholder="Например: Доставка"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Вопрос</Label>
                          <Input
                            value={item.question}
                            onChange={(e) =>
                              updateItem(index, "question", e.target.value)
                            }
                            className="bg-white/50"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Ответ</Label>
                          <Textarea
                            value={item.answer}
                            onChange={(e) =>
                              updateItem(index, "answer", e.target.value)
                            }
                            className="bg-white/50 min-h-[110px]"
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
            <CardTitle>CTA</CardTitle>
            <CardDescription>
              Блок внизу FAQ («Не нашли ответ?»).
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => toggleSection("cta")}
          >
            {openSections.cta ? "Свернуть" : "Развернуть"}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${openSections.cta ? "rotate-180" : ""}`}
            />
          </Button>
        </CardHeader>
        <Collapsible
          open={openSections.cta}
          onOpenChange={() => toggleSection("cta")}
        >
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Заголовок</Label>
                <Input
                  value={form.cta.title}
                  onChange={(e) => updateCta("title", e.target.value)}
                  className="bg-white/50"
                />
              </div>
              <div className="grid gap-2">
                <Label>Описание</Label>
                <Textarea
                  value={form.cta.description}
                  onChange={(e) => updateCta("description", e.target.value)}
                  className="bg-white/50 min-h-[100px]"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Текст кнопки</Label>
                  <Input
                    value={form.cta.buttonLabel}
                    onChange={(e) => updateCta("buttonLabel", e.target.value)}
                    className="bg-white/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Ссылка кнопки</Label>
                  <Input
                    value={form.cta.buttonHref}
                    onChange={(e) => updateCta("buttonHref", e.target.value)}
                    className="bg-white/50"
                    placeholder="/contact"
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

      <SaveBar visible={isDirty} saving={saving} onSave={handleSave} />
    </div>
  );
}
