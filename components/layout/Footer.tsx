"use client";

import { useEffect, useState } from "react";
import { siteSettings } from "@/data/site-settings";
import { cloneSiteSettings, isSiteSettings } from "@/lib/site-settings";
import { Z_INDEX } from "@/lib/constants";
import { DSLabel, DSContainer } from "@/components/ui/design-system";

const helpLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Связаться с нами", href: "/contact" },
  { label: "Оплата и доставка", href: "/payment-delivery" },
];

const documentLinks = [
  { label: "Политика конфиденциальности", href: "/privacy" },
  { label: "Публичная оферта", href: "/offer" },
  { label: "Реквизиты", href: "/legal-details" },
];

/**
 * Site footer refactored to use Design System components.
 */
const Footer = () => {
  const [settings, setSettings] = useState(() => cloneSiteSettings(siteSettings));

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

  const contactLinks = [
    { label: settings.contacts.email, href: `mailto:${settings.contacts.email}` },
    {
      label: settings.contacts.phone,
      href: `tel:${settings.contacts.phone.replace(/\s/g, "")}`,
    },
  ];

  const socialLinks = [
    { label: "Instagram*", href: settings.contacts.instagram },
    { label: "Telegram", href: settings.contacts.telegram },
    { label: "WhatsApp", href: settings.contacts.whatsapp },
  ];

  const columns = [
    { title: "Контакты", links: contactLinks },
    { title: "Помощь", links: helpLinks },
    { title: "Мы в сети", links: socialLinks },
    { title: "Документы", links: documentLinks },
  ];

  return (
    <footer
      className="w-full bg-background/80 backdrop-blur-xl pt-24 pb-16 border-t border-black/5"
      style={{ zIndex: Z_INDEX.footer }}
    >
      <DSContainer>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-12 lg:gap-24">
          {columns.map((column) => (
            <div key={column.title} className="space-y-6">
              <DSLabel className="text-accent">{column.title}</DSLabel>
              <div className="flex flex-col space-y-3">
                {column.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-[11px] font-body tracking-wider hover:text-accent transition-colors duration-300 w-fit"
                    {...(link.href.startsWith("http") && {
                      target: "_blank",
                      rel: "noreferrer",
                    })}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-col justify-end items-start md:items-end md:text-right space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] tracking-widest text-muted-foreground">
                  © Галерея интерьерного искусства Любовь 2014 - 2026.
                </p>
                <p className="text-[10px] tracking-widest text-muted-foreground">
                  Все права зарегистрированы. Копирование материалов запрещено!
                </p>
              </div>
              <p className="text-[10px] tracking-widest text-muted-foreground/60">
                ИНН 7707083893 / КПП 773643001
              </p>
              <div className="flex flex-col md:items-end space-y-2 pt-2">
                <a
                  href="/offer"
                  className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-accent transition-colors"
                >
                  Пользовательское соглашение
                </a>
                <a
                  href="/privacy"
                  className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-accent transition-colors"
                >
                  Согласие на обработку персональных данных
                </a>
              </div>
            </div>
            <div className="pt-4 border-t border-black/5 w-full md:w-auto">
              <p className="text-[8px] leading-relaxed text-muted-foreground/40 md:ml-auto whitespace-nowrap">
                * Деятельность META запрещена на территории РФ
              </p>
            </div>
          </div>
        </div>
      </DSContainer>
    </footer>
  );
};

export default Footer;
