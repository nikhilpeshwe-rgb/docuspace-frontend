export interface DocumentResponse {
  id: number;
  title: string;
  content: string;
  workspaceId: number;
  collectionId: number;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentRequest {
  title: string;
  content: string;
}

export interface UpdateDocumentRequest {
  title: string;
  content: string;
}

export interface DocumentVersionResponse {
  id: number;
  documentId: number;
  title: string;
  content: string;
  versionNumber: number;
  createdBy: number;
  createdAt: string;
}