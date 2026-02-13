"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname.startsWith("/admin/login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
    };
  }, [mobileMenuOpen]);

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-secondary/20 font-body">
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div
        className={cn(
          "p-4 md:ml-64",
          mobileMenuOpen && "pointer-events-none md:pointer-events-auto",
        )}
      >
        <ScrollArea className="h-screen">
          <div className="p-0 md:p-8 max-w-7xl mx-auto">
            <div className="mb-4 md:hidden">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="mr-2 h-4 w-4" />
                Меню
              </Button>
            </div>
            <AdminBreadcrumbs />
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
