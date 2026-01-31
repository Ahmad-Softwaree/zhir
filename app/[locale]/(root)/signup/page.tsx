import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { getLocale, getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, UserPlus } from "lucide-react";
import Link from "next/link";
import { ENUMs } from "@/lib/enums";

export default async function SignUpPage() {
  const locale = await getLocale();
  const t = await getTranslations();

  // Redirect authenticated users to chat
  const session = await auth0.getSession();
  if (session?.user) {
    redirect(`/${locale}/${ENUMs.PAGES.AI}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary to-secondary">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {t("auth.signup.title")}
          </CardTitle>
          <CardDescription>{t("auth.signup.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
            size="lg">
            <Link href="/auth/login">
              <Sparkles className="mr-2 h-5 w-5" />
              {t("auth.signup.button")}
            </Link>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("auth.or")}
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {t("auth.signup.hasAccount")}{" "}
            <Link
              href={`/${locale}/signin`}
              className="font-medium text-primary hover:underline">
              {t("auth.signup.signInLink")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
