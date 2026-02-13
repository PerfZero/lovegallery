"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { DSContainer, DSHeading, DSText } from "@/components/ui/design-system";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { siteSettings } from "@/data/site-settings";
import { formatPhoneNumber, isValidEmail, isValidPhone } from "@/lib/format";
import { cloneSiteSettings, isSiteSettings } from "@/lib/site-settings";

export default function ContactPage() {
  const [settings, setSettings] = useState(() =>
    cloneSiteSettings(siteSettings),
  );
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/site-settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (!isSiteSettings(data?.item)) return;
        setSettings(cloneSiteSettings(data.item));
      })
      .catch(() => {
        // Keep defaults
      });

    return () => {
      mounted = false;
    };
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!formState.name.trim()) newErrors.name = true;
    if (!isValidEmail(formState.email)) newErrors.email = true;
    if (formState.phone && !isValidPhone(formState.phone))
      newErrors.phone = true;
    if (!formState.message.trim()) newErrors.message = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getSubjectLabel = (value: string) => {
    const labels: Record<string, string> = {
      order: "Вопрос о заказе",
      consultation: "Консультация",
      custom: "Персональный заказ",
      collaboration: "Сотрудничество",
      other: "Другое",
    };
    return labels[value] || value || "Общая тема";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formType: "Форма обратной связи",
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          subject: getSubjectLabel(formState.subject),
          message: formState.message,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form after short delay
        setTimeout(() => {
          setIsSubmitted(false);
          setFormState({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
          });
          setErrors({});
        }, 5000);
      } else {
        console.error("Failed to send form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setFormState((prev) => ({ ...prev, [name]: formatted }));
      if (errors.phone) setErrors((prev) => ({ ...prev, phone: false }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const privacyPrefix = settings.contactPage.privacyText
    .replace(/\s*политикой\s+конфиденциальности\s*$/i, "")
    .trim();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-28 pb-24">
        {/* Hero */}
        <section className="mb-16 md:mb-24">
          <DSContainer>
            {/* Breadcrumbs */}
            <Breadcrumbs className="mb-8" />

            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-8">
                <MessageCircle size={14} className="text-accent" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">
                  {settings.contactPage.heroBadge}
                </span>
              </div>

              <DSHeading
                level="h1"
                className="text-4xl md:text-5xl lg:text-6xl mb-6"
              >
                {settings.contactPage.heroTitle}{" "}
                <span className="italic">
                  {settings.contactPage.heroTitleAccent}
                </span>
              </DSHeading>

              <DSText className="text-lg text-muted-foreground">
                {settings.contactPage.heroDescription}
              </DSText>
            </div>
          </DSContainer>
        </section>

        <DSContainer>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-display italic mb-6">
                  {settings.contactPage.infoTitle}
                </h2>

                <div className="space-y-6">
                  <a
                    href={`tel:${settings.contacts.phone.replace(/\s/g, "")}`}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                      <Phone size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                        Телефон
                      </p>
                      <p className="text-lg font-medium group-hover:text-accent transition-colors">
                        {settings.contacts.phone}
                      </p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${settings.contacts.email}`}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                      <Mail size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                        Email
                      </p>
                      <p className="text-lg font-medium group-hover:text-accent transition-colors">
                        {settings.contacts.email}
                      </p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                      <Clock size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                        Часы работы
                      </p>
                      <p className="font-medium">
                        {settings.contacts.workHoursWeekdays}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {settings.contacts.workHoursWeekend}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                        Адрес
                      </p>
                      <p className="font-medium">{settings.contacts.address}</p>
                      <p className="text-muted-foreground text-sm">
                        {settings.contacts.showroomNote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-8 border-t border-border/20">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  Мессенджеры
                </p>
                <div className="flex gap-3">
                  <a
                    href={settings.contacts.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 bg-[#0088cc] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Telegram
                  </a>
                  <a
                    href={settings.contacts.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 bg-[#25D366] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-muted/20 p-8 md:p-12 rounded-lg">
                <h2 className="text-2xl font-display italic mb-8">
                  {settings.contactPage.formTitle}
                </h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h3 className="text-2xl font-display italic mb-4">
                      {settings.contactPage.successTitle}
                    </h3>
                    <p className="text-muted-foreground">
                      {settings.contactPage.successDescription}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                          Имя *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:border-accent transition-colors ${errors.name ? "border-red-500 ring-1 ring-red-500" : "border-border"}`}
                          placeholder="Ваше имя"
                        />
                        {errors.name && (
                          <p className="text-[10px] text-red-500 mt-1">
                            Введите имя
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:border-accent transition-colors ${errors.email ? "border-red-500 ring-1 ring-red-500" : "border-border"}`}
                          placeholder="email@example.com"
                        />
                        {errors.email && (
                          <p className="text-[10px] text-red-500 mt-1">
                            Введите корректный email
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                          Телефон
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formState.phone}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:border-accent transition-colors ${errors.phone ? "border-red-500 ring-1 ring-red-500" : "border-border"}`}
                          placeholder="+7 495 477-34-34"
                        />
                        {errors.phone && (
                          <p className="text-[10px] text-red-500 mt-1">
                            Некорректный номер
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                          Тема
                        </label>
                        <select
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-accent transition-colors"
                        >
                          <option value="">Выберите тему</option>
                          <option value="order">Вопрос о заказе</option>
                          <option value="consultation">Консультация</option>
                          <option value="custom">Персональный заказ</option>
                          <option value="collaboration">Сотрудничество</option>
                          <option value="other">Другое</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                        Сообщение *
                      </label>
                      <textarea
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        rows={5}
                        className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:border-accent transition-colors resize-none ${errors.message ? "border-red-500 ring-1 ring-red-500" : "border-border"}`}
                        placeholder="Ваше сообщение..."
                      />
                      {errors.message && (
                        <p className="text-[10px] text-red-500 mt-1">
                          Введите сообщение
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs text-muted-foreground">
                        {privacyPrefix}{" "}
                        <a
                          href="/privacy"
                          className="underline hover:text-accent"
                        >
                          политикой конфиденциальности
                        </a>
                      </p>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-accent hover:text-foreground transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          "Отправка..."
                        ) : (
                          <>
                            <Send size={14} />
                            {settings.contactPage.sendButtonLabel}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </DSContainer>
      </main>

      <Footer />
    </div>
  );
}
