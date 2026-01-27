"use client";

import {
  Pagination as PaginationWrapper,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  searchParam?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  searchParam = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    return `?page=${page}${searchParam ? `&${searchParam}` : ""}`;
  };

  return (
    <div className="mt-8">
      <PaginationWrapper>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={buildUrl(Math.max(1, currentPage - 1))}
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            const showPage =
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

            if (!showPage) {
              if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return null;
            }

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href={buildUrl(pageNum)}
                  isActive={pageNum === currentPage}>
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href={buildUrl(Math.min(totalPages, currentPage + 1))}
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationWrapper>
    </div>
  );
}
