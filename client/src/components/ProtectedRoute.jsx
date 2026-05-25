import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/react";

export default function ProtectedRoute({ children }) {

    const { isLoaded, isSignedIn } = useAuth();

    /*
    |--------------------------------------------------------------------------
    | Prevent UI Flash While Clerk Loads
    |--------------------------------------------------------------------------
    */

    if (!isLoaded) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#030712]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"></div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Redirect Unauthenticated Users
    |--------------------------------------------------------------------------
    */

    if (!isSignedIn) {
        return <Navigate to="/" replace />;
    }

    /*
    |--------------------------------------------------------------------------
    | Authenticated User
    |--------------------------------------------------------------------------
    */

    return children;
}