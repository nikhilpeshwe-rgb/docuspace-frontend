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

export interface DocumentSummaryResponse {
  documentId: number;
  overview: string;
  keyPoints: string[];
  actionItems: string[];
  generatedAt: string;
}

export type RewriteMode = "improve" | "shorten" | "expand" | "fix_grammar";

export interface DocumentRewriteRequest {
  mode: RewriteMode;
}

export interface DocumentRewriteResponse {
  documentId: number;
  mode: RewriteMode;
  content: string;
  generatedAt: string;
}