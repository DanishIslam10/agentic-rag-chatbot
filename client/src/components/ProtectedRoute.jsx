import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {

    // Example auth check
    const {isLoggedIn} = useSelector((state) => state.auth);

    // If user NOT logged in
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    // If logged in
    return children;
}