import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
            <LoadingSpinner size="lg" message="Loading..." />
        </div>
    );
}
