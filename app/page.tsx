import { ENUMs } from "@/lib/enums";
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect(`/${ENUMs.GLOBAL.DEFAULT_LANG}`);
}
