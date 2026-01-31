import React from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCcw, Home, Sparkles } from "lucide-react";
import Link from "next/link";
import { ENUMs } from "@/lib/enums";

const PaymentCancelledPage = () => {
  const t = useTranslations("paymentCancelled");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-orange-500/10 flex items-center justify-center">
              <XCircle className="h-12 w-12 text-orange-500" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            {t("subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <p className="text-muted-foreground">{t("message")}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              asChild
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 transition-all duration-300">
              <Link href={ENUMs.PAGES.AI + "/blog/chat"}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                {t("tryAgain")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href={ENUMs.PAGES.AI + "/blog/chat"}>
                <Sparkles className="mr-2 h-4 w-4" />
                {t("goToBlog")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href={ENUMs.PAGES.HOME}>
                <Home className="mr-2 h-4 w-4" />
                {t("goHome")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelledPage;
