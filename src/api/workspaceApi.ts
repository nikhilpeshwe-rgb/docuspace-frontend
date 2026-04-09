import apiClient from "./axios";
import type {
    CreateWorkspaceRequest,
    WorkspaceResponse,
} from "../features/workspace/workspace.types";

export const getWorkspacesApi = async (): Promise<WorkspaceResponse[]> => {
  const response = await apiClient.get("/workspaces");
  return response.data;
};

export const createWorkspaceApi = async (
  data: CreateWorkspaceRequest
): Promise<WorkspaceResponse> => {
  const response = await apiClient.post("/workspaces", data);
  return response.data;
};