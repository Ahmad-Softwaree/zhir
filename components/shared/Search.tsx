"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search as SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Search({ className, placeholder }: any) {
  const router = useRouter();
  const params = useSearchParams();

  const search = params.get("search") || "";

  const updateSearch = (value: string) => {
    const newParams = new URLSearchParams(params.toString());
    if (value) newParams.set("search", value);
    else newParams.delete("search");
    newParams.set("page", "1"); // reset pagination
    router.replace(`?${newParams.toString()}`);
  };

  return (
    <div className="relative w-full">
      <Input
        value={search}
        onChange={(e) => updateSearch(e.target.value)}
        placeholder={placeholder}
        className={cn(className, "pe-10")}
      />

      {search === "" ? (
        <Button
          variant="link"
          className="absolute end-0 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="absolute end-0 top-1/2 -translate-y-1/2"
          onClick={() => updateSearch("")}>
          <X />
        </Button>
      )}
    </div>
  );
}
