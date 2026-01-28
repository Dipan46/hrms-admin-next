"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    message?: string;
    fullScreen?: boolean;
}

export default function LoadingSpinner({
    size = "md",
    message = "Loading...",
    fullScreen = false
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12"
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 dark:text-blue-400`} />
            {message && (
                <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            {spinner}
        </div>
    );
}

// Button with loading state
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    loadingText?: string;
    children: React.ReactNode;
}

export function LoadingButton({
    loading,
    loadingText = "Processing...",
    children,
    className = "",
    disabled,
    ...props
}: LoadingButtonProps) {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={`relative flex items-center justify-center ${className} ${loading ? 'cursor-wait' : ''}`}
        >
            {loading && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            {loading ? loadingText : children}
        </button>
    );
}
