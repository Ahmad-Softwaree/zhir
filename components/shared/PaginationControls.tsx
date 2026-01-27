"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePaginationQuery } from "@/hooks/usePaginationQueries";
import { useTranslations } from "next-intl";

type PaginationControlsProps = {
  totalPages: number;
  total: number;
};

const LIMIT_OPTIONS = [50, 100, 150, 200];

export function PaginationControls({
  totalPages,
  total,
}: PaginationControlsProps) {
  const t = useTranslations("pagination");
  const [{ page, limit }, setPaginationQueries] = usePaginationQuery();
  const currentPage = (page as number) - 1 || 0;
  const currentLimit = Number(limit) || 100;

  const onPageChange = (newPage: number) => {
    setPaginationQueries({ page: newPage + 1 });
  };
  const onLimitChange = (newLimit: number) => {
    setPaginationQueries({ limit: newLimit, page: 1 });
  };

  const startItem = currentPage * limit + 1;
  const endItem = Math.min((currentPage + 1) * limit, total);

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pages.push(0, 1, 2, "ellipsis", totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          0,
          "ellipsis",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1
        );
      } else {
        pages.push(
          0,
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          totalPages - 1
        );
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-10 ">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="hidden sm:inline">
          {t("showing")} {startItem}-{endItem} {t("of")} {total}
        </span>
        <span className="sm:hidden">
          {startItem}-{endItem} / {total}
        </span>
        <Select
          value={currentLimit.toString()}
          onValueChange={(value) => onLimitChange(Number(value))}>
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIMIT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
              className={
                currentPage === 0
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }>
              <span className="hidden sm:block">{t("previous")}</span>
            </PaginationPrevious>
          </PaginationItem>

          {pageNumbers.map((page, index) =>
            page === "ellipsis" ? (
              <PaginationItem
                key={`ellipsis-${index}`}
                className="hidden sm:inline-flex">
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem
                key={page}
                className={
                  index > 0 && index < pageNumbers.length - 1
                    ? "hidden sm:inline-flex"
                    : ""
                }>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer">
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages - 1 && onPageChange(currentPage + 1)
              }
              className={
                currentPage === totalPages - 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }>
              <span className="hidden sm:block">{t("next")}</span>
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
