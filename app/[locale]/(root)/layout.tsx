import Footer from "@/components/layouts/footer";
import Header from "@/components/layouts/header";
import { PageTransition } from "@/components/shared/page-transition";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="flex-1 min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
};

export default layout;
