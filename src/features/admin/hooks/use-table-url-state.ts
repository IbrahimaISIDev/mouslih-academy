"use client";

import { useState } from "react";
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryState } from "nuqs";

export function useTableUrlState<F extends string>(
  filterValues: readonly F[],
  defaults: { q: string; filter: F; page: number },
) {
  const [q, setQLocal] = useState(defaults.q);
  const [filter, setFilterLocal] = useState<F>(defaults.filter);
  const [page, setPageLocal] = useState(defaults.page);

  const [, setQUrl] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ history: "replace" }),
  );
  const [, setFilterUrl] = useQueryState(
    "filter",
    parseAsStringEnum<F>([...filterValues])
      .withDefault(defaults.filter)
      .withOptions({ history: "replace" }),
  );
  const [, setPageUrl] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ history: "replace" }),
  );

  function setQ(value: string) {
    setQLocal(value);
    setPageLocal(1);
    setQUrl(value || null);
    setPageUrl(null);
  }

  function setFilter(value: F) {
    setFilterLocal(value);
    setPageLocal(1);
    setFilterUrl(value === defaults.filter ? null : value);
    setPageUrl(null);
  }

  function setPage(value: number) {
    setPageLocal(value);
    setPageUrl(value === 1 ? null : value);
  }

  return { q, setQ, filter, setFilter, page, setPage };
}
