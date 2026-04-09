export interface CollectionResponse {
  id: number;
  name: string;
  workspaceId: number;
  createdAt: string;
}

export interface CreateCollectionRequest {
  name: string;
}