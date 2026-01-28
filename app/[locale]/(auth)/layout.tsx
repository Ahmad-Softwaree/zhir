import ChatInput from "@/components/chat/ChatInput";
import Header from "@/components/layouts/header";
import CustomSidebar from "@/components/layouts/sidebar";
import { PageTransition } from "@/components/shared/page-transition";
import { Card } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getAllChats } from "@/lib/actions/chat.server.action";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const data = await getAllChats();
  return (
    <SidebarProvider>
      <CustomSidebar chats={data} />
      <SidebarInset className="!p-0">
        <Header />
        <main className="flex-1 max-h-[75vh] overflow-y-auto py-10 no-scrollbar">
          <PageTransition>{children}</PageTransition>
        </main>
        <div className="border-t bg-background">
          <Card className="border-0 border-t rounded-none shadow-none">
            <ChatInput />
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
