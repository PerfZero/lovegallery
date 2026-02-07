import { AdminPageHeader } from "@/components/admin/page-header";
import { artworks } from "@/data/artworks";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminCatalogPage() {
    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="Каталог"
                description="Управление товарами и арт-объектами."
                action={
                    <Button className="bg-foreground text-background hover:bg-foreground/90 font-medium">
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить товар
                    </Button>
                }
            />

            {/* Filters */}
            <div className="flex items-center space-x-4 max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Поиск по названию..."
                        className="pl-9 bg-white/60 border-border/40"
                    />
                </div>
            </div>

            {/* Table */}
            <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="w-full text-left text-sm">
                        {/* Header */}
                        <div className="flex items-center border-b border-border/40 bg-secondary/30 p-4 font-medium text-muted-foreground">
                            <div className="w-20 pl-4">Фото</div>
                            <div className="flex-1">Название</div>
                            <div className="w-32 hidden md:block">Категория</div>
                            <div className="w-32 hidden md:block">Цена</div>
                            <div className="w-32 hidden md:block">Статус</div>
                            <div className="w-10"></div>
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-border/40">
                            {artworks.map((artwork) => (
                                <div key={artwork.id} className="flex items-center p-4 hover:bg-secondary/40 transition-colors group">
                                    <div className="w-20 pl-4">
                                        <div className="h-10 w-10 rounded-md bg-cover bg-center border border-border/30" style={{ backgroundImage: `url(${artwork.image})` }} />
                                    </div>
                                    <div className="flex-1 font-medium text-foreground">
                                        {artwork.title}
                                        <div className="md:hidden text-xs text-muted-foreground mt-1">{artwork.category}</div>
                                    </div>
                                    <div className="w-32 hidden md:block text-muted-foreground capitalize">
                                        {artwork.category}
                                    </div>
                                    <div className="w-32 hidden md:block text-muted-foreground">
                                        {artwork.price}
                                    </div>
                                    <div className="w-32 hidden md:block">
                                        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                                            Активен
                                        </span>
                                    </div>
                                    <div className="w-10 flex justify-end pr-4">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
