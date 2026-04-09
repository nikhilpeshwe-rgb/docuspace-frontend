import type { SearchResponse } from "../features/search/search.types";
import apiClient from "./axios";

export const searchDocumentsApi = async (
  query: string
): Promise<SearchResponse[]> => {
  const response = await apiClient.get("/search", {
    params: { query },
  });

  return response.data;
};