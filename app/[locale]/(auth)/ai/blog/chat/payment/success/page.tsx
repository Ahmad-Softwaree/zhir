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
import { CheckCircle2, Sparkles, Home, Coins } from "lucide-react";
import Link from "next/link";
import { ENUMs } from "@/lib/enums";

const PaymentSuccessPage = () => {
  const t = useTranslations("paymentSuccess");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            {t("subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-lg p-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Coins className="h-8 w-8 text-amber-500" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {t("creditsAdded")}
                </p>
                <p className="text-3xl font-bold text-amber-500">10</p>
              </div>
            </div>
          </div>

          <p className="text-center text-muted-foreground">{t("message")}</p>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              asChild
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 transition-all duration-300">
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

export default PaymentSuccessPage;
