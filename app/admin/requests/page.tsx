"use client";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal, Phone, Mail, CheckCircle, Clock, Archive, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const requests = [
    {
        id: 1,
        client: "Александр Волков",
        contact: "+7 (999) 123-45-67",
        type: "Заказ",
        details: "Картина 'Abstract Form I'",
        status: "New",
        priority: true,
        date: "10 мин. назад"
    },
    {
        id: 2,
        client: "Елена Смирнова",
        contact: "elena.s@example.com",
        type: "Консультация",
        details: "Помощь с подбором для гостиной",
        status: "Processing",
        priority: false,
        date: "2 часа назад"
    },
    {
        id: 3,
        client: "Иван Петров",
        contact: "+7 (916) 000-00-00",
        type: "Вопрос",
        details: "Есть ли доставка в Санкт-Петербург?",
        status: "Done",
        priority: false,
        date: "Вчера"
    },
    {
        id: 4,
        client: "Ольга К.",
        contact: "+7 (903) 555-55-55",
        type: "Услуга",
        details: "Перетяжка дивана, запрос цены",
        status: "Processing",
        priority: true,
        date: "Вчера"
    }
];

export default function AdminRequestsPage() {
    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="Заявки"
                description="Управление входящими обращениями клиентов."
            />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Поиск по имени или телефону..."
                        className="pl-9 bg-white/60 border-border/40"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Button variant="outline" className="text-muted-foreground border-border/40 whitespace-nowrap">Все (24)</Button>
                    <Button variant="ghost" className="text-muted-foreground whitespace-nowrap">Новые (3)</Button>
                    <Button variant="ghost" className="text-muted-foreground whitespace-nowrap">В работе (5)</Button>
                    <Button variant="ghost" className="text-muted-foreground whitespace-nowrap">Архив</Button>
                </div>
            </div>

            {/* CRM List */}
            <div className="grid gap-4">
                {requests.map((request) => (
                    <Card key={request.id} className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm hover:shadow-md transition-all group">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full mt-1 ${request.status === 'New' ? 'bg-accent/10 text-accent' : 'bg-secondary text-muted-foreground'}`}>
                                        {request.status === 'New' && <Clock size={20} />}
                                        {request.status === 'Processing' && <Clock size={20} className="text-orange-500" />}
                                        {request.status === 'Done' && <CheckCircle size={20} className="text-green-500" />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-foreground text-lg">{request.client}</h3>
                                            {request.status === 'New' && <Badge variant="default" className="bg-accent text-white text-xs h-5">Новая</Badge>}
                                        </div>
                                        <p className="text-sm text-foreground/80 font-medium flex items-center gap-2">
                                            {request.type}: <span className="text-muted-foreground font-normal">{request.details}</span>
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                                            <span className="flex items-center gap-1 hover:text-accent cursor-pointer transition-colors">
                                                {request.contact.includes('@') ? <Mail size={12} /> : <Phone size={12} />}
                                                {request.contact}
                                            </span>
                                            <span>•</span>
                                            <span>{request.date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end md:self-center">
                                    <Button size="icon" variant="ghost" className={`hover:text-amber-400 ${request.priority ? 'text-amber-400' : 'text-muted-foreground'}`}>
                                        <Star size={18} className={request.priority ? "fill-amber-400" : ""} />
                                    </Button>
                                    <Button size="sm" variant="outline" className="hidden group-hover:flex">
                                        В работу
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
                                        <Archive size={18} />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
                                        <MoreHorizontal size={18} />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
