import apiClient from "./axios";
import type {
    CollectionResponse,
    CreateCollectionRequest,
} from "../features/collections/collection.types";

export const getCollectionsByWorkspaceApi = async (
  workspaceId: number
): Promise<CollectionResponse[]> => {
  const response = await apiClient.get(`/workspaces/${workspaceId}/collections`);
  return response.data;
};

export const createCollectionApi = async ({
  workspaceId,
  data,
}: {
  workspaceId: number;
  data: CreateCollectionRequest;
}): Promise<CollectionResponse> => {
  const response = await apiClient.post(
    `/workspaces/${workspaceId}/collections`,
    data
  );
  return response.data;
};