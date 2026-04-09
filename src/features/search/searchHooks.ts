import { useQuery } from "@tanstack/react-query";
import { searchDocumentsApi } from "../../api/searchApi";

export const useSearchDocuments = (query: string) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchDocumentsApi(query),
    enabled: !!query.trim(),
  });
};