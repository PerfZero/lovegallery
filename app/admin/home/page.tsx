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
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { SaveBar } from "@/components/admin/save-bar";
import { toast } from "@/components/ui/sonner";
import { homeContent, type HomeContentData } from "@/data/home-content";
import { cloneHomeContent, isHomeContent } from "@/lib/home-content";

function normalizeHomeContent(form: HomeContentData): HomeContentData {
  return {
    animatedOverlay: {
      line1: form.animatedOverlay.line1.trim(),
      line2: form.animatedOverlay.line2.trim(),
    },
    hero: {
      tagline: {
        intro: form.hero.tagline.intro.trim(),
        emphasis: form.hero.tagline.emphasis.trim(),
        highlight: form.hero.tagline.highlight.trim(),
      },
      description: {
        main: form.hero.description.main.trim(),
        continuation: form.hero.description.continuation.trim(),
        adjectives: form.hero.description.adjectives
          .map((item) => item.trim())
          .filter(Boolean),
        suffix: form.hero.description.suffix.trim(),
      },
    },
    contact: {
      headline: {
        line1: form.contact.headline.line1.trim(),
        line2: form.contact.headline.line2.trim(),
      },
      cta: {
        label: form.contact.cta.label.trim(),
      },
    },
  };
}

export default function AdminHomePage() {
  const [form, setForm] = useState<HomeContentData>(
    cloneHomeContent(homeContent),
  );
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(normalizeHomeContent(cloneHomeContent(homeContent))),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openSections, setOpenSections] = useState({
    overlay: true,
    hero: true,
    contact: true,
  });

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/home-content", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (!isHomeContent(data?.item)) return;
        const nextForm = cloneHomeContent(data.item);
        setForm(nextForm);
        setSavedSnapshot(JSON.stringify(normalizeHomeContent(nextForm)));
      })
      .catch(() => {
        if (!mounted) return;
        setError("Не удалось загрузить контент главной страницы.");
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

  const updateOverlay = (
    key: keyof HomeContentData["animatedOverlay"],
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      animatedOverlay: { ...prev.animatedOverlay, [key]: value },
    }));
  };

  const updateHeroTagline = (
    key: keyof HomeContentData["hero"]["tagline"],
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        tagline: { ...prev.hero.tagline, [key]: value },
      },
    }));
  };

  const updateHeroDescription = (
    key: Exclude<keyof HomeContentData["hero"]["description"], "adjectives">,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        description: { ...prev.hero.description, [key]: value },
      },
    }));
  };

  const updateAdjective = (index: number, value: string) => {
    setForm((prev) => {
      const adjectives = [...prev.hero.description.adjectives];
      adjectives[index] = value;
      return {
        ...prev,
        hero: {
          ...prev.hero,
          description: {
            ...prev.hero.description,
            adjectives,
          },
        },
      };
    });
  };

  const addAdjective = () => {
    setForm((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        description: {
          ...prev.hero.description,
          adjectives: [...prev.hero.description.adjectives, ""],
        },
      },
    }));
  };

  const removeAdjective = (index: number) => {
    setForm((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        description: {
          ...prev.hero.description,
          adjectives: prev.hero.description.adjectives.filter(
            (_, i) => i !== index,
          ),
        },
      },
    }));
  };

  const updateContactHeadline = (
    key: keyof HomeContentData["contact"]["headline"],
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        headline: { ...prev.contact.headline, [key]: value },
      },
    }));
  };

  const updateContactCta = (value: string) => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        cta: { ...prev.contact.cta, label: value },
      },
    }));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    const normalized = normalizeHomeContent(form);

    if (
      normalized.hero.description.adjectives.length === 0 &&
      form.hero.description.adjectives.length > 0
    ) {
      setError(
        "При заполненных полях прилагательных нельзя сохранять пустые значения.",
      );
      return;
    }

    if (!isHomeContent(normalized)) {
      setError("Проверьте заполненность полей на главной странице.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/home-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Не удалось сохранить изменения.");
        return;
      }

      setForm(cloneHomeContent(normalized));
      setSavedSnapshot(JSON.stringify(normalized));
      setSuccess("Изменения сохранены.");
      toast.success("Изменения сохранены");
    } catch {
      setError("Ошибка сети при сохранении.");
    } finally {
      setSaving(false);
    }
  };

  const normalizedForm = useMemo(() => normalizeHomeContent(form), [form]);
  const isDirty = JSON.stringify(normalizedForm) !== savedSnapshot;

  if (loading) {
    return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  }

  return (
    <div className="space-y-8 pb-20 max-w-5xl">
      <AdminPageHeader
        title="Главная страница"
        description="Редактирование текстовых блоков на публичной странице /."
      />

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Текст-оверлей</CardTitle>
            <CardDescription>
              Крупный анимированный текст в первом экране.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => toggleSection("overlay")}
          >
            {openSections.overlay ? "Свернуть" : "Развернуть"}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${
                openSections.overlay ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CardHeader>
        <Collapsible
          open={openSections.overlay}
          onOpenChange={() => toggleSection("overlay")}
        >
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Строка 1</Label>
                  <Input
                    value={form.animatedOverlay.line1}
                    onChange={(e) => updateOverlay("line1", e.target.value)}
                    className="bg-white/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Строка 2</Label>
                  <Input
                    value={form.animatedOverlay.line2}
                    onChange={(e) => updateOverlay("line2", e.target.value)}
                    className="bg-white/50"
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Hero</CardTitle>
            <CardDescription>
              Основной заголовок и описание в первом блоке главной.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => toggleSection("hero")}
          >
            {openSections.hero ? "Свернуть" : "Развернуть"}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${
                openSections.hero ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CardHeader>
        <Collapsible
          open={openSections.hero}
          onOpenChange={() => toggleSection("hero")}
        >
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Tagline: intro</Label>
                  <Input
                    value={form.hero.tagline.intro}
                    onChange={(e) => updateHeroTagline("intro", e.target.value)}
                    className="bg-white/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Tagline: emphasis</Label>
                  <Input
                    value={form.hero.tagline.emphasis}
                    onChange={(e) =>
                      updateHeroTagline("emphasis", e.target.value)
                    }
                    className="bg-white/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Tagline: highlight</Label>
                  <Input
                    value={form.hero.tagline.highlight}
                    onChange={(e) =>
                      updateHeroTagline("highlight", e.target.value)
                    }
                    className="bg-white/50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Описание: main</Label>
                  <Input
                    value={form.hero.description.main}
                    onChange={(e) =>
                      updateHeroDescription("main", e.target.value)
                    }
                    className="bg-white/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Описание: continuation</Label>
                  <Input
                    value={form.hero.description.continuation}
                    onChange={(e) =>
                      updateHeroDescription("continuation", e.target.value)
                    }
                    className="bg-white/50"
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label>Прилагательные</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAdjective}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Добавить
                  </Button>
                </div>
                <div className="space-y-2">
                  {form.hero.description.adjectives.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateAdjective(index, e.target.value)}
                        className="bg-white/50"
                        placeholder={`Прилагательное ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeAdjective(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {form.hero.description.adjectives.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Список пуст. Добавьте минимум одно слово.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Описание: suffix</Label>
                <Input
                  value={form.hero.description.suffix}
                  onChange={(e) =>
                    updateHeroDescription("suffix", e.target.value)
                  }
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
            <CardTitle>Контактный блок</CardTitle>
            <CardDescription>
              Финальный CTA на главной с заголовком и подписью.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => toggleSection("contact")}
          >
            {openSections.contact ? "Свернуть" : "Развернуть"}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${
                openSections.contact ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CardHeader>
        <Collapsible
          open={openSections.contact}
          onOpenChange={() => toggleSection("contact")}
        >
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Заголовок: строка 1</Label>
                  <Input
                    value={form.contact.headline.line1}
                    onChange={(e) =>
                      updateContactHeadline("line1", e.target.value)
                    }
                    className="bg-white/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Заголовок: строка 2</Label>
                  <Input
                    value={form.contact.headline.line2}
                    onChange={(e) =>
                      updateContactHeadline("line2", e.target.value)
                    }
                    className="bg-white/50"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Подпись над email</Label>
                <Input
                  value={form.contact.cta.label}
                  onChange={(e) => updateContactCta(e.target.value)}
                  className="bg-white/50"
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {(error || success) && (
        <div className="space-y-2">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
              {success}
            </p>
          )}
        </div>
      )}

      <SaveBar visible={isDirty} saving={saving} onSave={handleSave} />
    </div>
  );
}
