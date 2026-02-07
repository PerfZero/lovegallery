"use client";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-8 pb-20 max-w-4xl">
            <AdminPageHeader
                title="Настройки"
                description="Конфигурация сайта, контакты и SEO."
            />

            <div className="grid gap-6">
                {/* General Info */}
                <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
                    <CardHeader>
                        <CardTitle>Основная информация</CardTitle>
                        <CardDescription>Название сайта и глобальные мета-данные.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="siteName">Название сайта</Label>
                            <Input id="siteName" defaultValue="Beloved" className="bg-white/40" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="siteDesc">Описание (Meta Description)</Label>
                            <Textarea
                                id="siteDesc"
                                defaultValue="Эксклюзивные решения для частных и общественных пространств. Искусство, декор и мебель ручной работы."
                                className="bg-white/40 min-h-[100px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Contacts */}
                <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
                    <CardHeader>
                        <CardTitle>Контакты</CardTitle>
                        <CardDescription>Информация, отображаемая в футере и на странице контактов.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Телефон</Label>
                                <Input id="phone" defaultValue="+7 (999) 000-00-00" className="bg-white/40" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" defaultValue="info@beloved.art" className="bg-white/40" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Адрес</Label>
                            <Input id="address" defaultValue="г. Москва, ул. Примерная, д. 1" className="bg-white/40" />
                        </div>
                    </CardContent>
                </Card>

                {/* Socials */}
                <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
                    <CardHeader>
                        <CardTitle>Социальные сети</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="telegram">Telegram</Label>
                            <Input id="telegram" defaultValue="https://t.me/beloved_art" className="bg-white/40" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="whatsapp">WhatsApp</Label>
                            <Input id="whatsapp" defaultValue="https://wa.me/..." className="bg-white/40" />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button variant="ghost">Отмена</Button>
                    <Button>Сохранить настройки</Button>
                </div>
            </div>
        </div>
    );
}
