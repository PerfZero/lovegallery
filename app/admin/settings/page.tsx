"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { siteSettings, type SiteSettingsData } from "@/data/site-settings";
import { cloneSiteSettings, isSiteSettings } from "@/lib/site-settings";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSettingsData>(
    cloneSiteSettings(siteSettings),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    fetch("/api/admin/site-settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (!isSiteSettings(data?.item)) return;
        setForm(cloneSiteSettings(data.item));
      })
      .catch(() => {
        if (!mounted) return;
        setError("Не удалось загрузить настройки сайта.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const updateMaintenance = (
    key: Exclude<keyof SiteSettingsData["maintenance"], "enabled">,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      maintenance: {
        ...prev.maintenance,
        [key]: value,
      },
    }));
  };

  const updateContacts = (
    key: keyof SiteSettingsData["contacts"],
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [key]: value,
      },
    }));
  };

  const updateContactPage = (
    key: keyof SiteSettingsData["contactPage"],
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      contactPage: {
        ...prev.contactPage,
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    const normalized: SiteSettingsData = {
      maintenance: {
        enabled: form.maintenance.enabled,
        brandLabel: form.maintenance.brandLabel.trim(),
        title: form.maintenance.title.trim(),
        description: form.maintenance.description.trim(),
      },
      contacts: {
        email: form.contacts.email.trim(),
        phone: form.contacts.phone.trim(),
        instagram: form.contacts.instagram.trim(),
        telegram: form.contacts.telegram.trim(),
        whatsapp: form.contacts.whatsapp.trim(),
        address: form.contacts.address.trim(),
        workHoursWeekdays: form.contacts.workHoursWeekdays.trim(),
        workHoursWeekend: form.contacts.workHoursWeekend.trim(),
        showroomNote: form.contacts.showroomNote.trim(),
      },
      contactPage: {
        heroBadge: form.contactPage.heroBadge.trim(),
        heroTitle: form.contactPage.heroTitle.trim(),
        heroTitleAccent: form.contactPage.heroTitleAccent.trim(),
        heroDescription: form.contactPage.heroDescription.trim(),
        infoTitle: form.contactPage.infoTitle.trim(),
        formTitle: form.contactPage.formTitle.trim(),
        successTitle: form.contactPage.successTitle.trim(),
        successDescription: form.contactPage.successDescription.trim(),
        privacyText: form.contactPage.privacyText.trim(),
        sendButtonLabel: form.contactPage.sendButtonLabel.trim(),
      },
    };

    if (!isSiteSettings(normalized)) {
      setError("Проверьте заполненность полей настроек.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Не удалось сохранить настройки.");
        return;
      }

      setForm(cloneSiteSettings(normalized));
      setSuccess("Настройки сохранены.");
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
    <div className="space-y-8 pb-20 max-w-5xl">
      <AdminPageHeader
        title="Настройки"
        description="Управление заглушкой, контактами футера и страницей /contact."
      />

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle>Заглушка сайта</CardTitle>
          <CardDescription>
            При включении все публичные страницы будут заменены заглушкой.
            Админка и API остаются доступными.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-white/50 px-4 py-3">
            <div className="space-y-1">
              <Label
                htmlFor="maintenance-enabled"
                className="text-sm font-medium"
              >
                Включить заглушку
              </Label>
              <p className="text-xs text-muted-foreground">
                Публичный сайт будет временно недоступен.
              </p>
            </div>
            <Switch
              id="maintenance-enabled"
              checked={form.maintenance.enabled}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  maintenance: { ...prev.maintenance, enabled: checked },
                }))
              }
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="maintenance-brand">
                Лейбл бренда (было Beloved)
              </Label>
              <Input
                id="maintenance-brand"
                value={form.maintenance.brandLabel}
                onChange={(e) =>
                  updateMaintenance("brandLabel", e.target.value)
                }
                className="bg-white/40"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maintenance-title">Заголовок</Label>
              <Input
                id="maintenance-title"
                value={form.maintenance.title}
                onChange={(e) => updateMaintenance("title", e.target.value)}
                className="bg-white/40"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="maintenance-description">Описание</Label>
            <Textarea
              id="maintenance-description"
              value={form.maintenance.description}
              onChange={(e) => updateMaintenance("description", e.target.value)}
              className="bg-white/40 min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle>Контакты (футер и /contact)</CardTitle>
          <CardDescription>
            Эти данные используются в колонке &quot;Контакты&quot; в футере и в
            блоке контактов на странице /contact.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                value={form.contacts.email}
                onChange={(e) => updateContacts("email", e.target.value)}
                className="bg-white/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Телефон</Label>
              <Input
                value={form.contacts.phone}
                onChange={(e) => updateContacts("phone", e.target.value)}
                className="bg-white/40"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label>Instagram URL</Label>
              <Input
                value={form.contacts.instagram}
                onChange={(e) => updateContacts("instagram", e.target.value)}
                className="bg-white/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Telegram URL</Label>
              <Input
                value={form.contacts.telegram}
                onChange={(e) => updateContacts("telegram", e.target.value)}
                className="bg-white/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>WhatsApp URL</Label>
              <Input
                value={form.contacts.whatsapp}
                onChange={(e) => updateContacts("whatsapp", e.target.value)}
                className="bg-white/40"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Адрес</Label>
            <Input
              value={form.contacts.address}
              onChange={(e) => updateContacts("address", e.target.value)}
              className="bg-white/40"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Часы работы (будни)</Label>
              <Input
                value={form.contacts.workHoursWeekdays}
                onChange={(e) =>
                  updateContacts("workHoursWeekdays", e.target.value)
                }
                className="bg-white/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Часы работы (выходные)</Label>
              <Input
                value={form.contacts.workHoursWeekend}
                onChange={(e) =>
                  updateContacts("workHoursWeekend", e.target.value)
                }
                className="bg-white/40"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Примечание по шоу-руму</Label>
            <Input
              value={form.contacts.showroomNote}
              onChange={(e) => updateContacts("showroomNote", e.target.value)}
              className="bg-white/40"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle>Страница /contact</CardTitle>
          <CardDescription>
            Тексты hero, формы и сообщения об успешной отправке.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Бейдж в hero</Label>
              <Input
                value={form.contactPage.heroBadge}
                onChange={(e) => updateContactPage("heroBadge", e.target.value)}
                className="bg-white/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Заголовок (первая часть)</Label>
              <Input
                value={form.contactPage.heroTitle}
                onChange={(e) => updateContactPage("heroTitle", e.target.value)}
                className="bg-white/40"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Заголовок (акцент)</Label>
              <Input
                value={form.contactPage.heroTitleAccent}
                onChange={(e) =>
                  updateContactPage("heroTitleAccent", e.target.value)
                }
                className="bg-white/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Заголовок блока контактов</Label>
              <Input
                value={form.contactPage.infoTitle}
                onChange={(e) => updateContactPage("infoTitle", e.target.value)}
                className="bg-white/40"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Описание hero</Label>
            <Textarea
              value={form.contactPage.heroDescription}
              onChange={(e) =>
                updateContactPage("heroDescription", e.target.value)
              }
              className="bg-white/40 min-h-[90px]"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Заголовок формы</Label>
              <Input
                value={form.contactPage.formTitle}
                onChange={(e) => updateContactPage("formTitle", e.target.value)}
                className="bg-white/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Текст кнопки отправки</Label>
              <Input
                value={form.contactPage.sendButtonLabel}
                onChange={(e) =>
                  updateContactPage("sendButtonLabel", e.target.value)
                }
                className="bg-white/40"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Заголовок успешной отправки</Label>
              <Input
                value={form.contactPage.successTitle}
                onChange={(e) =>
                  updateContactPage("successTitle", e.target.value)
                }
                className="bg-white/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Описание успешной отправки</Label>
              <Input
                value={form.contactPage.successDescription}
                onChange={(e) =>
                  updateContactPage("successDescription", e.target.value)
                }
                className="bg-white/40"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Текст перед ссылкой на политику</Label>
            <Input
              value={form.contactPage.privacyText}
              onChange={(e) => updateContactPage("privacyText", e.target.value)}
              className="bg-white/40"
            />
          </div>
        </CardContent>
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

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="min-w-[220px]"
        >
          {saving ? "Сохранение..." : "Сохранить настройки"}
        </Button>
      </div>
    </div>
  );
}
