import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-950">
            <LoadingSpinner size="lg" message="Loading HRMS..." />
        </div>
    );
}
