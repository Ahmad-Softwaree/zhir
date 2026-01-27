"use client";

import { FileQuestion } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NoData() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{t("common.no_data")}</h3>
      <p className="text-muted-foreground max-w-md">
        {t("common.no_data_found")}
      </p>
    </div>
  );
}
