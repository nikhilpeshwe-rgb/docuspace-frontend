import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkspaceApi, getWorkspacesApi } from "../../api/workspaceApi";

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspacesApi,
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkspaceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};