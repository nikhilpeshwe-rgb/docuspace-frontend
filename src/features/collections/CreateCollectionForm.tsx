import { type SyntheticEvent, useState } from "react";
import { useCreateCollection } from "./collectionHooks";
import { AxiosError } from "axios";

interface CreateCollectionFormProps {
    workspaceId: number;
}

interface CreateCollectionError {
    message?: string;
}

const CreateCollectionForm = ({ workspaceId }: CreateCollectionFormProps) => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const createCollectionMutation = useCreateCollection(workspaceId);

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Collection name is required");
            return;
        }

        try {
            await createCollectionMutation.mutateAsync(name);
            setName("");
        } catch (err: unknown) {
            const message = err instanceof AxiosError
                ? (err.response?.data as CreateCollectionError | undefined)?.message
                : undefined;
            setError(message || "Failed to create collection");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
            <h2>Create Collection</h2>

            <input
                type="text"
                placeholder="Enter collection name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                    padding: "8px",
                    width: "300px",
                    marginRight: "8px",
                }}
            />

            <button type="submit" disabled={createCollectionMutation.isPending}>
                {createCollectionMutation.isPending ? "Creating..." : "Create"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
};

export default CreateCollectionForm;