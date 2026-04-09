export interface WorkspaceResponse {
  id: number;
  name: string;
  ownerId: number;
}

export interface CreateWorkspaceRequest {
  name: string;
}