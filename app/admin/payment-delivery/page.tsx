"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { SaveBar } from "@/components/admin/save-bar";
import { toast } from "@/components/ui/sonner";
import {
  paymentDeliveryContent,
  type PaymentDeliveryContentData,
  type PaymentDeliveryLogo,
} from "@/data/payment-delivery-content";
import {
  clonePaymentDeliveryContent,
  isPaymentDeliveryContent,
} from "@/lib/payment-delivery-content";

function makeEmptyLogo(): PaymentDeliveryLogo {
  return {
    name: "",
    image: "",
    alt: "",
  };
}

function normalizePaymentDeliveryContent(
  form: PaymentDeliveryContentData,
): PaymentDeliveryContentData {
  return {
    hero: {
      badge: form.hero.badge.trim(),
      titlePrimary: form.hero.titlePrimary.trim(),
      titleAccent: form.hero.titleAccent.trim(),
      description: form.hero.description.trim(),
    },
    features: form.features
      .map((item) => ({
        title: item.title.trim(),
        description: item.description.trim(),
      }))
      .filter((item) => item.title || item.description),
    concierge: {
      ...form.concierge,
      badge: form.concierge.badge.trim(),
      titlePrimary: form.concierge.titlePrimary.trim(),
      titleAccent: form.concierge.titleAccent.trim(),
      description: form.concierge.description.trim(),
      image: form.concierge.image.trim(),
      imageBadge: {
        kicker: form.concierge.imageBadge.kicker.trim(),
        text: form.concierge.imageBadge.text.trim(),
      },
      bullets: form.concierge.bullets
        .map((item) => item.trim())
        .filter(Boolean),
    },
    logistics: {
      ...form.logistics,
      badge: form.logistics.badge.trim(),
      titlePrimary: form.logistics.titlePrimary.trim(),
      titleAccent: form.logistics.titleAccent.trim(),
      description: form.logistics.description.trim(),
      image: form.logistics.image.trim(),
      highlights: form.logistics.highlights
        .map((item) => item.trim())
        .filter(Boolean),
      partners: form.logistics.partners
        .map((item) => item.trim())
        .filter(Boolean),
    },
    payment: {
      ...form.payment,
      title: form.payment.title.trim(),
      description: form.payment.description.trim(),
      logos: form.payment.logos
        .map((logo) => ({
          name: logo.name.trim(),
          image: logo.image.trim(),
          alt: logo.alt.trim(),
        }))
        .filter((logo) => logo.name || logo.image || logo.alt),
      trustBadges: form.payment.trustBadges
        .map((item) => item.trim())
        .filter(Boolean),
    },
  };
}

export default function AdminPaymentDeliveryPage() {
  const [form, setForm] = useState<PaymentDeliveryContentData>(
    clonePaymentDeliveryContent(paymentDeliveryContent),
  );
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(
      normalizePaymentDeliveryContent(
        clonePaymentDeliveryContent(paymentDeliveryContent),
      ),
    ),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState({
    hero: true,
    features: true,
    concierge: true,
    logistics: true,
    payment: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/payment-delivery", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (!isPaymentDeliveryContent(data?.item)) return;
        const nextForm = clonePaymentDeliveryContent(data.item);
        setForm(nextForm);
        setSavedSnapshot(
          JSON.stringify(normalizePaymentDeliveryContent(nextForm)),
        );
      })
      .catch(() => {
        if (!mounted) return;
        setError("Не удалось загрузить контент страницы «Оплата и доставка».");
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

  const updateHero = (
    key: keyof PaymentDeliveryContentData["hero"],
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }));
  };

  const updateFeature = (
    index: number,
    key: keyof PaymentDeliveryContentData["features"][number],
    value: string,
  ) => {
    setForm((prev) => {
      const next = [...prev.features];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, features: next };
    });
  };

  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, { title: "", description: "" }],
    }));
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateConcierge = (
    key: "badge" | "titlePrimary" | "titleAccent" | "description",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      concierge: { ...prev.concierge, [key]: value },
    }));
  };

  const updateConciergeImageBadge = (key: "kicker" | "text", value: string) => {
    setForm((prev) => ({
      ...prev,
      concierge: {
        ...prev.concierge,
        imageBadge: { ...prev.concierge.imageBadge, [key]: value },
      },
    }));
  };

  const updateConciergeBullet = (index: number, value: string) => {
    setForm((prev) => {
      const bullets = [...prev.concierge.bullets];
      bullets[index] = value;
      return {
        ...prev,
        concierge: { ...prev.concierge, bullets },
      };
    });
  };

  const addConciergeBullet = () => {
    setForm((prev) => ({
      ...prev,
      concierge: {
        ...prev.concierge,
        bullets: [...prev.concierge.bullets, ""],
      },
    }));
  };

  const removeConciergeBullet = (index: number) => {
    setForm((prev) => ({
      ...prev,
      concierge: {
        ...prev.concierge,
        bullets: prev.concierge.bullets.filter((_, i) => i !== index),
      },
    }));
  };

  const updateLogistics = (
    key: "badge" | "titlePrimary" | "titleAccent" | "description",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      logistics: { ...prev.logistics, [key]: value },
    }));
  };

  const updateLogisticsHighlight = (index: number, value: string) => {
    setForm((prev) => {
      const highlights = [...prev.logistics.highlights];
      highlights[index] = value;
      return {
        ...prev,
        logistics: { ...prev.logistics, highlights },
      };
    });
  };

  const addLogisticsHighlight = () => {
    setForm((prev) => ({
      ...prev,
      logistics: {
        ...prev.logistics,
        highlights: [...prev.logistics.highlights, ""],
      },
    }));
  };

  const removeLogisticsHighlight = (index: number) => {
    setForm((prev) => ({
      ...prev,
      logistics: {
        ...prev.logistics,
        highlights: prev.logistics.highlights.filter((_, i) => i !== index),
      },
    }));
  };

  const updateLogisticsPartner = (index: number, value: string) => {
    setForm((prev) => {
      const partners = [...prev.logistics.partners];
      partners[index] = value;
      return {
        ...prev,
        logistics: { ...prev.logistics, partners },
      };
    });
  };

  const addLogisticsPartner = () => {
    setForm((prev) => ({
      ...prev,
      logistics: {
        ...prev.logistics,
        partners: [...prev.logistics.partners, ""],
      },
    }));
  };

  const removeLogisticsPartner = (index: number) => {
    setForm((prev) => ({
      ...prev,
      logistics: {
        ...prev.logistics,
        partners: prev.logistics.partners.filter((_, i) => i !== index),
      },
    }));
  };

  const updatePayment = (key: "title" | "description", value: string) => {
    setForm((prev) => ({
      ...prev,
      payment: { ...prev.payment, [key]: value },
    }));
  };

  const updatePaymentLogo = (
    index: number,
    key: keyof PaymentDeliveryLogo,
    value: string,
  ) => {
    setForm((prev) => {
      const logos = [...prev.payment.logos];
      logos[index] = { ...logos[index], [key]: value };
      return {
        ...prev,
        payment: { ...prev.payment, logos },
      };
    });
  };

  const addPaymentLogo = () => {
    setForm((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        logos: [...prev.payment.logos, makeEmptyLogo()],
      },
    }));
  };

  const removePaymentLogo = (index: number) => {
    setForm((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        logos: prev.payment.logos.filter((_, i) => i !== index),
      },
    }));
  };

  const updateTrustBadge = (index: number, value: string) => {
    setForm((prev) => {
      const trustBadges = [...prev.payment.trustBadges];
      trustBadges[index] = value;
      return {
        ...prev,
        payment: { ...prev.payment, trustBadges },
      };
    });
  };

  const addTrustBadge = () => {
    setForm((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        trustBadges: [...prev.payment.trustBadges, ""],
      },
    }));
  };

  const removeTrustBadge = (index: number) => {
    setForm((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        trustBadges: prev.payment.trustBadges.filter((_, i) => i !== index),
      },
    }));
  };

  const handleImageUpload = async (
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

  const handleSave = async () => {
    setError("");
    setSuccess("");

    const normalized = normalizePaymentDeliveryContent(form);

    if (!isPaymentDeliveryContent(normalized)) {
      setError("Проверьте обязательные поля и заполненность блоков.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/payment-delivery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Не удалось сохранить изменения.");
        return;
      }

      setForm(clonePaymentDeliveryContent(normalized));
      setSavedSnapshot(JSON.stringify(normalized));
      setSuccess("Изменения сохранены.");
      toast.success("Изменения сохранены");
    } catch {
      setError("Ошибка сети при сохранении.");
    } finally {
      setSaving(false);
    }
  };

  const normalizedForm = useMemo(
    () => normalizePaymentDeliveryContent(form),
    [form],
  );
  const isDirty = JSON.stringify(normalizedForm) !== savedSnapshot;

  if (loading) {
    return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  }

  return (
    <div className="space-y-8 pb-20 max-w-6xl">
      <AdminPageHeader
        title="Страница «Оплата и доставка»"
        description="Редактирование контента страницы /payment-delivery."
      />

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Hero</CardTitle>
            <CardDescription>Первый экран страницы.</CardDescription>
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
            <CardTitle>Преимущества</CardTitle>
            <CardDescription>
              Карточки из трех иконок под первым экраном.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={addFeature}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => toggleSection("features")}
            >
              {openSections.features ? "Свернуть" : "Развернуть"}
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform ${openSections.features ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
        <Collapsible
          open={openSections.features}
          onOpenChange={() => toggleSection("features")}
        >
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {form.features.map((feature, index) => (
                <div
                  key={`feature-${index}`}
                  className="rounded-lg border border-border/40 bg-white/50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Карточка {index + 1}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Удалить
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label>Заголовок</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) =>
                          updateFeature(index, "title", e.target.value)
                        }
                        className="bg-white/50"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Описание</Label>
                      <Input
                        value={feature.description}
                        onChange={(e) =>
                          updateFeature(index, "description", e.target.value)
                        }
                        className="bg-white/50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Консьерж-сервис</CardTitle>
            <CardDescription>
              Левая секция с фото и списком пунктов.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => toggleSection("concierge")}
          >
            {openSections.concierge ? "Свернуть" : "Развернуть"}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${openSections.concierge ? "rotate-180" : ""}`}
            />
          </Button>
        </CardHeader>
        <Collapsible
          open={openSections.concierge}
          onOpenChange={() => toggleSection("concierge")}
        >
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Бейдж</Label>
                  <Input
                    value={form.concierge.badge}
                    onChange={(e) => updateConcierge("badge", e.target.value)}
                    className="bg-white/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Заголовок (1 строка)</Label>
                  <Input
                    value={form.concierge.titlePrimary}
                    onChange={(e) =>
                      updateConcierge("titlePrimary", e.target.value)
                    }
                    className="bg-white/50"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Заголовок (2 строка)</Label>
                <Input
                  value={form.concierge.titleAccent}
                  onChange={(e) =>
                    updateConcierge("titleAccent", e.target.value)
                  }
                  className="bg-white/50"
                />
              </div>

              <div className="grid gap-2">
                <Label>Описание</Label>
                <Textarea
                  value={form.concierge.description}
                  onChange={(e) =>
                    updateConcierge("description", e.target.value)
                  }
                  className="bg-white/50 min-h-[100px]"
                />
              </div>

              <div className="grid gap-2">
                <Label>Изображение</Label>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative w-full md:w-56 h-40 rounded-lg border border-border/40 bg-secondary/30 overflow-hidden">
                    {form.concierge.image ? (
                      <Image
                        src={form.concierge.image}
                        alt="Concierge"
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
                      id="payment-concierge-image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        void handleImageUpload(
                          "payment-concierge-image",
                          (url) =>
                            setForm((prev) => ({
                              ...prev,
                              concierge: { ...prev.concierge, image: url },
                            })),
                          file,
                        );
                        e.currentTarget.value = "";
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploadingField === "payment-concierge-image"}
                      onClick={() =>
                        triggerFileInput("payment-concierge-image-input")
                      }
                    >
                      {uploadingField === "payment-concierge-image"
                        ? "Загрузка..."
                        : form.concierge.image
                          ? "Заменить фото"
                          : "Загрузить фото"}
                    </Button>
                    {form.concierge.image && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            concierge: { ...prev.concierge, image: "" },
                          }))
                        }
                      >
                        Удалить фото
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Подпись на фото (верх)</Label>
                  <Input
                    value={form.concierge.imageBadge.kicker}
                    onChange={(e) =>
                      updateConciergeImageBadge("kicker", e.target.value)
                    }
                    className="bg-white/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Подпись на фото (низ)</Label>
                  <Input
                    value={form.concierge.imageBadge.text}
                    onChange={(e) =>
                      updateConciergeImageBadge("text", e.target.value)
                    }
                    className="bg-white/50"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Список пунктов</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addConciergeBullet}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить пункт
                  </Button>
                </div>
                {form.concierge.bullets.map((item, index) => (
                  <div key={`concierge-bullet-${index}`} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) =>
                        updateConciergeBullet(index, e.target.value)
                      }
                      className="bg-white/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeConciergeBullet(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Логистика</CardTitle>
            <CardDescription>
              Секция с преимуществами упаковки и партнерами.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => toggleSection("logistics")}
          >
            {openSections.logistics ? "Свернуть" : "Развернуть"}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${openSections.logistics ? "rotate-180" : ""}`}
            />
          </Button>
        </CardHeader>
        <Collapsible
          open={openSections.logistics}
          onOpenChange={() => toggleSection("logistics")}
        >
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Бейдж</Label>
                  <Input
                    value={form.logistics.badge}
                    onChange={(e) => updateLogistics("badge", e.target.value)}
                    className="bg-white/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Заголовок (1 строка)</Label>
                  <Input
                    value={form.logistics.titlePrimary}
                    onChange={(e) =>
                      updateLogistics("titlePrimary", e.target.value)
                    }
                    className="bg-white/50"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Заголовок (2 строка)</Label>
                <Input
                  value={form.logistics.titleAccent}
                  onChange={(e) =>
                    updateLogistics("titleAccent", e.target.value)
                  }
                  className="bg-white/50"
                />
              </div>
              <div className="grid gap-2">
                <Label>Описание</Label>
                <Textarea
                  value={form.logistics.description}
                  onChange={(e) =>
                    updateLogistics("description", e.target.value)
                  }
                  className="bg-white/50 min-h-[100px]"
                />
              </div>

              <div className="grid gap-2">
                <Label>Изображение</Label>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative w-full md:w-56 h-40 rounded-lg border border-border/40 bg-secondary/30 overflow-hidden">
                    {form.logistics.image ? (
                      <Image
                        src={form.logistics.image}
                        alt="Logistics"
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
                      id="payment-logistics-image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        void handleImageUpload(
                          "payment-logistics-image",
                          (url) =>
                            setForm((prev) => ({
                              ...prev,
                              logistics: { ...prev.logistics, image: url },
                            })),
                          file,
                        );
                        e.currentTarget.value = "";
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploadingField === "payment-logistics-image"}
                      onClick={() =>
                        triggerFileInput("payment-logistics-image-input")
                      }
                    >
                      {uploadingField === "payment-logistics-image"
                        ? "Загрузка..."
                        : form.logistics.image
                          ? "Заменить фото"
                          : "Загрузить фото"}
                    </Button>
                    {form.logistics.image && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            logistics: { ...prev.logistics, image: "" },
                          }))
                        }
                      >
                        Удалить фото
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Преимущества логистики</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLogisticsHighlight}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить
                  </Button>
                </div>
                {form.logistics.highlights.map((item, index) => (
                  <div
                    key={`logistics-highlight-${index}`}
                    className="flex gap-2"
                  >
                    <Input
                      value={item}
                      onChange={(e) =>
                        updateLogisticsHighlight(index, e.target.value)
                      }
                      className="bg-white/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeLogisticsHighlight(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Партнеры</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLogisticsPartner}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить
                  </Button>
                </div>
                {form.logistics.partners.map((item, index) => (
                  <div
                    key={`logistics-partner-${index}`}
                    className="flex gap-2"
                  >
                    <Input
                      value={item}
                      onChange={(e) =>
                        updateLogisticsPartner(index, e.target.value)
                      }
                      className="bg-white/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeLogisticsPartner(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Оплата</CardTitle>
            <CardDescription>
              Секция «Прозрачность сделки» и платежные логотипы.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => toggleSection("payment")}
          >
            {openSections.payment ? "Свернуть" : "Развернуть"}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${openSections.payment ? "rotate-180" : ""}`}
            />
          </Button>
        </CardHeader>
        <Collapsible
          open={openSections.payment}
          onOpenChange={() => toggleSection("payment")}
        >
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Заголовок</Label>
                <Input
                  value={form.payment.title}
                  onChange={(e) => updatePayment("title", e.target.value)}
                  className="bg-white/50"
                />
              </div>
              <div className="grid gap-2">
                <Label>Описание</Label>
                <Textarea
                  value={form.payment.description}
                  onChange={(e) => updatePayment("description", e.target.value)}
                  className="bg-white/50 min-h-[100px]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Логотипы платежей</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPaymentLogo}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить логотип
                  </Button>
                </div>
                {form.payment.logos.map((logo, index) => (
                  <div
                    key={`payment-logo-${index}`}
                    className="rounded-lg border border-border/40 bg-white/50 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Логотип {index + 1}: {logo.name || "Без названия"}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removePaymentLogo(index)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Удалить
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Название</Label>
                        <Input
                          value={logo.name}
                          onChange={(e) =>
                            updatePaymentLogo(index, "name", e.target.value)
                          }
                          className="bg-white/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Alt</Label>
                        <Input
                          value={logo.alt}
                          onChange={(e) =>
                            updatePaymentLogo(index, "alt", e.target.value)
                          }
                          className="bg-white/50"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative w-full md:w-56 h-24 rounded-lg border border-border/40 bg-secondary/30 overflow-hidden">
                        {logo.image ? (
                          <Image
                            src={logo.image}
                            alt={logo.alt || logo.name || `logo-${index}`}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                            Нет изображения
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <input
                          id={`payment-logo-input-${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            void handleImageUpload(
                              `payment-logo-${index}`,
                              (url) => updatePaymentLogo(index, "image", url),
                              file,
                            );
                            e.currentTarget.value = "";
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploadingField === `payment-logo-${index}`}
                          onClick={() =>
                            triggerFileInput(`payment-logo-input-${index}`)
                          }
                        >
                          {uploadingField === `payment-logo-${index}`
                            ? "Загрузка..."
                            : logo.image
                              ? "Заменить логотип"
                              : "Загрузить логотип"}
                        </Button>
                        {logo.image && (
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              updatePaymentLogo(index, "image", "")
                            }
                          >
                            Удалить изображение
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Trust badges</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTrustBadge}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить
                  </Button>
                </div>
                {form.payment.trustBadges.map((item, index) => (
                  <div key={`trust-badge-${index}`} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateTrustBadge(index, e.target.value)}
                      className="bg-white/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeTrustBadge(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
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
