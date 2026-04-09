import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCollectionApi,
  getCollectionsByWorkspaceApi,
} from "../../api/collectionApi";

export const useCollections = (workspaceId: number) => {
  return useQuery({
    queryKey: ["collections", workspaceId],
    queryFn: () => getCollectionsByWorkspaceApi(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useCreateCollection = (workspaceId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) =>
      createCollectionApi({
        workspaceId,
        data: { name },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections", workspaceId] });
    },
  });
};