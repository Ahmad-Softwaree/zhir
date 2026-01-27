import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import React from "react";
import { ThemeProvider } from "next-themes";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
const Providers = async ({ children }: { children: React.ReactNode }) => {
  return (
    <Auth0Provider>
      <NuqsAdapter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </NuqsAdapter>
    </Auth0Provider>
  );
};

export default Providers;
