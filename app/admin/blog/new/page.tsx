"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Image as ImageIcon, Sparkles, Save } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewArticlePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
                <Link href="/admin/blog" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <ArrowLeft size={16} />
                    Назад к блогу
                </Link>
                <div className="flex gap-4">
                    <span className="text-sm text-muted-foreground flex items-center">
                        <Sparkles size={14} className="mr-2" />
                        Черновик сохранен
                    </span>
                    <Button variant="outline">Предпросмотр</Button>
                    <Button>Опубликовать</Button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="space-y-6 mt-12 bg-white/40 backdrop-blur-sm p-10 rounded-xl border border-border/30 min-h-[80vh]">

                {/* Cover Image Placeholder */}
                <div className="w-full h-48 rounded-lg border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-muted-foreground hover:border-accent/50 hover:bg-accent/5 hover:text-accent transition-all cursor-pointer group">
                    <ImageIcon size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Добавить обложку</span>
                </div>

                <Input
                    className="text-4xl md:text-5xl font-display italic font-bold border-none bg-transparent px-0 placeholder:text-muted-foreground/40 focus-visible:ring-0 h-auto py-4"
                    placeholder="Заголовок статьи..."
                />

                <div className="flex gap-2">
                    {['Дизайн', 'Тренды', 'Советы'].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-secondary/50 rounded-full text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                            #{tag}
                        </span>
                    ))}
                    <span className="px-3 py-1 border border-dashed border-border rounded-full text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                        + Тег
                    </span>
                </div>

                <Textarea
                    className="w-full min-h-[500px] resize-none border-none bg-transparent px-0 text-lg leading-relaxed focus-visible:ring-0 placeholder:text-muted-foreground/30 font-serif"
                    placeholder="Начните писать здесь..."
                />
            </div>
        </div>
    );
}
