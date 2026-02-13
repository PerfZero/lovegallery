"use client";

import { Button } from "@/components/ui/button";

interface SaveBarProps {
  visible: boolean;
  saving?: boolean;
  label?: string;
  savingLabel?: string;
  onSave: () => void;
}

export function SaveBar({
  visible,
  saving = false,
  label = "Сохранить изменения",
  savingLabel = "Сохранение...",
  onSave,
}: SaveBarProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-40 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 md:w-auto">
      <div className="rounded-2xl border border-border/60 bg-white/90 p-3 shadow-xl backdrop-blur-sm">
        <Button onClick={onSave} disabled={saving} className="w-full min-w-[240px] md:w-auto">
          {saving ? savingLabel : label}
        </Button>
      </div>
    </div>
  );
}
