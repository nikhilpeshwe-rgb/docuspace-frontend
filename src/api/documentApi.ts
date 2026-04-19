import apiClient from "./axios";
import type {
    CreateDocumentRequest,
    DocumentResponse,
    UpdateDocumentRequest,
    DocumentVersionResponse,
    DocumentSummaryResponse,
    DocumentRewriteRequest,
    DocumentRewriteResponse,
    AiJobCreatedResponse,
    AiJobStatusResponse,
    CreateRewriteJobRequest
} from "../features/documents/document.types";

export const getDocumentsByCollectionApi = async (
  collectionId: number
): Promise<DocumentResponse[]> => {
  const response = await apiClient.get(`/collections/${collectionId}/documents`);
  return response.data;
};

export const createDocumentApi = async ({
  collectionId,
  data,
}: {
  collectionId: number;
  data: CreateDocumentRequest;
}): Promise<DocumentResponse> => {
  const response = await apiClient.post(
    `/collections/${collectionId}/documents`,
    data
  );
  return response.data;
};

export const getDocumentByIdApi = async (
  documentId: number
): Promise<DocumentResponse> => {
  const response = await apiClient.get(`/documents/${documentId}`);
  return response.data;
};

export const updateDocumentApi = async ({
  documentId,
  data,
}: {
  documentId: number;
  data: UpdateDocumentRequest;
}): Promise<DocumentResponse> => {
  const response = await apiClient.put(`/documents/${documentId}`, data);
  return response.data;
};

export const getDocumentVersionsApi = async (
  documentId: number
): Promise<DocumentVersionResponse[]> => {
  const response = await apiClient.get(`/documents/${documentId}/versions`);
  return response.data;
};

export const restoreDocumentVersionApi = async ({
  documentId,
  versionId,
}: {
  documentId: number;
  versionId: number;
}): Promise<DocumentResponse> => {
  const response = await apiClient.post(
    `/documents/${documentId}/restore/${versionId}`
  );
  return response.data;
};

export const summarizeDocumentApi = async (
  documentId: number
): Promise<DocumentSummaryResponse> => {
  const response = await apiClient.post(`/documents/${documentId}/summarize`);
  return response.data;
};

export const rewriteDocumentApi = async ({
  documentId,
  data,
}: {
  documentId: number;
  data: DocumentRewriteRequest;
}): Promise<DocumentRewriteResponse> => {
  const response = await apiClient.post(`/documents/${documentId}/rewrite`, data);
  return response.data;
};

// Async API's
export const createSummaryJobApi = async (
  documentId: number
): Promise<AiJobCreatedResponse> => {
  const response = await apiClient.post("/ai/jobs/summarize", { documentId });
  return response.data;
};

export const createRewriteJobApi = async ({
  documentId,
  data,
}: {
  documentId: number;
  data: CreateRewriteJobRequest;
}): Promise<AiJobCreatedResponse> => {
  const response = await apiClient.post("/ai/jobs/rewrite", {
    documentId,
    mode: data.mode,
  });
  return response.data;
};

export const getAiJobStatusApi = async (
  jobId: number
): Promise<AiJobStatusResponse> => {
  const response = await apiClient.get(`/ai/jobs/${jobId}`);
  return response.data;
};