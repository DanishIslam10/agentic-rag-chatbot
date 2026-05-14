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