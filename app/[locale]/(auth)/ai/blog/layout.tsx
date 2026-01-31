import Header from "@/components/layouts/header";
import CustomSidebar from "@/components/layouts/sidebar";
import { PageTransition } from "@/components/shared/page-transition";
import { Card } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import CustomError from "@/components/CustomError";
import { getAllBlogs } from "@/lib/actions/blog.action";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const data = await getAllBlogs();
  if ((data as any).__isError) {
    return <CustomError />;
  }
  return (
    <SidebarProvider>
      <CustomSidebar type="blog" data={data} />
      <SidebarInset className="!p-0">
        <Header />
        <main className="flex-1 max-h-scren overflow-y-auto py-10 no-scrollbar">
          <PageTransition>{children}</PageTransition>
        </main>
        <div className="border-t bg-background">
          <Card className="border-0 border-t rounded-none shadow-none"></Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
