"use client";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Eye, ShoppingBag, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="Обзор"
                description="Добро пожаловать в панель управления Beloved."
            />

            {/* Insight Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm relative overflow-hidden group">
                    {/* Gradient BG Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative font-medium">
                        <CardTitle className="text-sm text-muted-foreground">Новые заявки</CardTitle>
                        <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    </CardHeader>
                    <CardContent className="relative">
                        <div className="text-3xl font-display font-semibold italic">3</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Требуют внимания
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Продажи (Мес)</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">145 000 ₽</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <ArrowUpRight size={12} className="mr-1" />
                            +12% к прошлому
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Просмотры</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12.5K</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Стабильный рост
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Товаров в каталоге</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            2 скрыто
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Requests Widget */}
                <Card className="col-span-4 bg-white/60 backdrop-blur-sm border-border/40 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Входящие заявки</CardTitle>
                        <Link href="/admin/requests" className="text-xs text-muted-foreground hover:text-accent transition-colors flex items-center">
                            В раздел
                            <ArrowUpRight size={12} className="ml-1" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { client: "Александр Волков", type: "Заказ", detail: "Abstract Form I", time: "10 мин", status: "new" },
                                { client: "Елена Смирнова", type: "Консультация", detail: "Подбор для гостиной", time: "2 ч", status: "process" },
                                { client: "Ольга К.", type: "Услуга", detail: "Перетяжка", time: "Вчера", status: "process" },
                            ].map((item, i) => (
                                <div key={i} data-cursor-hover className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${item.status === 'new' ? 'bg-accent' : 'bg-orange-300'}`} />
                                        <div>
                                            <p className="text-sm font-medium leading-none group-hover:text-accent transition-colors">{item.client}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{item.type} • {item.detail}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground bg-white/50 px-2 py-1 rounded-md border border-border/20">{item.time}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Chart Mockup */}
                <Card className="col-span-3 bg-white/60 backdrop-blur-sm border-border/40 shadow-sm overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg">Активность (Неделя)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full flex items-end justify-between gap-2 pt-4">
                            {[40, 70, 45, 90, 65, 80, 55].map((height, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 1, delay: i * 0.1, ease: [0.33, 1, 0.68, 1] }}
                                        className="w-full bg-secondary/60 rounded-t-sm group-hover:bg-accent/40 transition-colors relative"
                                    >
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold">
                                            {Math.round(height * 12.5)}
                                        </div>
                                    </motion.div>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
