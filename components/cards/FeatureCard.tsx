"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Feature } from "../sections/features";
import { useTranslations } from "next-intl";
import { ArrowRight, Coins } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "@/i18n/navigation";

const FeatureCard = (
  val: Feature & {
    route?: string;
  }
) => {
  const t = useTranslations("home.features");
  const tChat = useTranslations("chatSelection");
  const router = useRouter();

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        "border-2 hover:border-primary/50"
      )}>
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
            {val.icon}
          </div>
          {val.badge && (
            <Badge variant={val.badgeVariant} className="text-xs">
              {t(val.badge as any)}
            </Badge>
          )}
        </div>
        <CardTitle className="text-2xl mb-2">
          {t(val.titleKey as any)}
        </CardTitle>
        <CardDescription className="text-base">
          {t(val.descriptionKey as any)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            {val.type === "blogGenerator" && (
              <Coins className="h-4 w-4 text-amber-500" />
            )}
            <span>{t(`${val.type}.features.0`)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>{t(`${val.type}.features.1`)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>{t(`${val.type}.features.2`)}</span>
          </div>
        </div>
        {val?.route && (
          <Button
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all mt-5"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              if (val.route) router.push(val.route);
            }}>
            {tChat("getStarted")}
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
