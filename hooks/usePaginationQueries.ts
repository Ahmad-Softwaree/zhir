import { useQueryState, parseAsInteger } from "nuqs";

export function usePaginationQuery() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(100)
  );

  const setPaginationQueries = ({
    page: newPage,
    limit: newLimit,
  }: {
    page?: number;
    limit?: number;
  }) => {
    if (newPage !== undefined) setPage(newPage);
    if (newLimit !== undefined) setLimit(newLimit);
  };

  return [{ page, limit }, setPaginationQueries] as const;
}
