import { signupService, loginService } from "../services/auth.service.js";

export const signup = async (req, res) => {
    try {

        const result = await signupService(req.body);

        return res.status(201).json({
            success: true,
            ...result
        })

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });

    }
}

export const login = async (req, res) => {
    try {

        const result = await loginService(req.body);

        res.cookie(
            "token",
            result.token,
            {
                httpOnly: true,

                secure: false,

                sameSite: "lax",

                maxAge: 7 * 24 * 60 * 60 * 1000,
            }
        );

        return res.status(200).json({
            success: true,
            ...result,
        });

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });

    }
};

export const restoreAuthState = async (req, res) => {
    try {
        const token = req.cookies.token;
        // Add logic to verify the token and restore the authentication state
        res.status(200).json({
            success: true,
            message: "Authentication state restored successfully",
            user: req.user, // Assuming the authMiddleware attaches the user data to the request object
        });
    } catch (error) {
        console.error("Error restoring auth state:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {  
            httpOnly: true,
            secure: true,
            sameSite: "lax",
        });
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
