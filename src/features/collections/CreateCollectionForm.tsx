import { type SyntheticEvent, useState } from "react";
import { useCreateCollection } from "./collectionHooks";
import { AxiosError } from "axios";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

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
        <form onSubmit={handleSubmit} className="space-y-3">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collection name"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                disabled={createCollectionMutation.isPending}
            />

            <Button type="submit" disabled={createCollectionMutation.isPending}>
                {createCollectionMutation.isPending ? "Creating..." : "Create"}
            </Button>
            {error && <Message type="error" text={error} />}
        </form>
    );
};

export default CreateCollectionForm;