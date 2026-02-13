"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { galleryImages } from "@/data/gallery-images";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, SlidersHorizontal, Trash2 } from "lucide-react";
import { SaveBar } from "@/components/admin/save-bar";
import { toast } from "@/components/ui/sonner";

export default function AdminGalleryPage() {
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    setSaving(false);
    setIsDirty(false);
    toast.success("Изменения сохранены");
  };

  return (
    <div className="space-y-8 pb-20">
      <AdminPageHeader
        title="Галерея"
        description="Управление визуальной сеткой и отступами изображений."
        action={
          <Button
            className="bg-foreground text-background hover:bg-foreground/90 font-medium"
            onClick={() => setIsDirty(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Загрузить фото
          </Button>
        }
      />

      {/* Visual Grid Mockup */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {galleryImages.map((image, index) => (
          <div key={index} className="group relative">
            {/* Image Preview Card */}
            <Card className="bg-white/60 backdrop-blur-sm border-border/40 shadow-sm overflow-hidden transition-all hover:shadow-md relative z-10">
              <div className="aspect-[4/5] w-full bg-secondary/20 relative">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="secondary"
                    className="bg-white/80 backdrop-blur-sm"
                  >
                    Z-{parseInt(image.z.replace("z-", ""))}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-4">
                <div>
                  <Input
                    defaultValue={image.title}
                    onChange={() => setIsDirty(true)}
                    className="font-medium border-transparent px-0 h-auto focus-visible:ring-0 hover:bg-secondary/40 -ml-2 pl-2 rounded-md transition-colors"
                  />
                  <p className="text-xs text-muted-foreground">
                    {image.category}
                  </p>
                </div>

                {/* Mock Controls */}
                <div className="space-y-3 pt-2 border-t border-border/30">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <SlidersHorizontal size={12} /> Отступ сверху
                    </span>
                    <span>{image.marginTopPx.desktop}px</span>
                  </div>
                  <Slider
                    defaultValue={[image.marginTopPx.desktop || 0]}
                    max={200}
                    step={10}
                    className="w-full"
                    onValueChange={() => setIsDirty(true)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <SlidersHorizontal size={12} /> Отступ слева
                    </span>
                    <span>{image.marginLeftPx.desktop}px</span>
                  </div>
                  <Slider
                    defaultValue={[Math.abs(image.marginLeftPx.desktop)]}
                    max={100}
                    step={5}
                    className="w-full"
                    onValueChange={() => setIsDirty(true)}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setIsDirty(true)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Visual Connector Line (Decorative) */}
            <div className="absolute -inset-2 border border-dashed border-border/30 rounded-xl -z-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>

      <SaveBar visible={isDirty} saving={saving} onSave={handleSave} />
    </div>
  );
}
