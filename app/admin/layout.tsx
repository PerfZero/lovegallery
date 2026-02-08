"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname.startsWith("/admin/login");

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-secondary/20 font-body">
      <AdminSidebar />
      <div className="p-4 sm:ml-64">
        <ScrollArea className="h-screen">
          <div className="p-8 max-w-7xl mx-auto">
            <AdminBreadcrumbs />
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
