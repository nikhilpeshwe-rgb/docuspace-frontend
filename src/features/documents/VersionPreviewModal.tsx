import type { DocumentVersion } from "../../api/documentVersionApi";

type VersionPreviewModalProps = {
  version: DocumentVersion | null;
  onClose: () => void;
};

export default function VersionPreviewModal({
  version,
  onClose,
}: VersionPreviewModalProps) {
  if (!version) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Version #{version.id}
            </h2>
            <p className="text-sm text-gray-500">
              {new Date(version.createdAt).toLocaleString()}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto p-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
              {version.title || "Untitled"}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Content
            </label>
            <div className="min-h-[300px] whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
              {version.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}