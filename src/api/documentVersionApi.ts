import apiClient from "../api/axios";export interface DocumentVersion  {
  id: number;
  documentId: number;
  title: string;
  content: string;
  createdAt: string;
  createdBy?: number;
};

export async function getDocumentVersions(documentId: string): Promise<DocumentVersion[]> {
  const response = await apiClient.get(`/documents/${documentId}/versions`);
  return response.data;
}

export async function getDocumentVersionById(
  documentId: string,
  versionId: string
): Promise<DocumentVersion> {
  const response = await apiClient.get(`/documents/${documentId}/versions/${versionId}`);
  return response.data;
}