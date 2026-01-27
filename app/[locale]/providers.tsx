import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import React from "react";
import { ThemeProvider } from "next-themes";

const Providers = async ({ children }: { children: React.ReactNode }) => {
  return (
    <NuqsAdapter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </NuqsAdapter>
  );
};

export default Providers;
