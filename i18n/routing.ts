import { ENUMs } from "@/lib/enums";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar", "ckb"],
  defaultLocale: ENUMs.GLOBAL.DEFAULT_LANG,
});
