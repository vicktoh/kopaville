import { useToast } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { algoliaIndex } from "../services/algolia";

export function useSearchIndex<T>(
  index: string,
  initialFilter?: string,
  perpage?: number,
  continuos: boolean=false,
  initialReady:boolean=true,
) {
  const [query, setQuery] = useState<string>("");
  const [ready, setReady] = useState<boolean>(initialReady);
  const [filters, setFilters] = useState<string>(initialFilter || "");
  const [facets, setFacets] = useState<(string | string[])[]>();
  const [groups, setGroups] =
    useState<Record<keyof T | string, Record<string, number> | undefined>>();
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageStat, setpageStats] = useState<{
    total: number;
    pages: number;
    currentPage: number;
  }>();
  const [data, setData] = useState<T[]>();
  const toast = useToast();
  console.log("facet", facets);
  console.log("filters", filters);
  const search = useCallback(async () => {
    try {
      setLoading(true);
      const usersIndex = algoliaIndex(index);
      const response = await usersIndex.search(query, {
        page,
        hitsPerPage: perpage || 30,
        ...(filters ? { filters } : null),
        facetFilters: facets,
        facets: ["*"],
      });
      const {
        hits,
        nbHits,
        page: currentPage,
        nbPages,
        facets: categories,
      } = response;
      setData(continuos &&  page > 0 ? [...(data || []), ...hits] : hits as any);
      setpageStats({
        total: nbHits,
        pages: nbPages,
        currentPage: currentPage,
      });
      setPage(currentPage);
      if (!groups) setGroups(categories as any);
    } catch (error) {
      const err: any = error;
      // toast.show({
      //   title: `Unable to fetch the ${index}`,
      //   description: err?.message || "Unknown Error",
      //   variant: "subtle",
      // });
    } finally {
      setLoading(false);
    }
  }, [page, query, toast, index, groups, filters, facets, perpage]);
  useEffect(() => {
    let cancelled = false;
    if(!ready) return;
    if(!cancelled) search();
    return ()=> {
cancelled = true
    }
  }, [search, ready]);
  return {
    page,
    setPage,
    pageStat,
    loading,
    setQuery,
    setFilters,
    setFacets,
    data,
    setData,
    search,
    groups,
    setReady,
  };
}
