import express from "express"
import { signup, login, restoreAuthState,logout } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router()

router.post("/signup",signup);
router.post("/login",login);
router.get("/restore-auth-state",authMiddleware,restoreAuthState);
router.get("/logout",authMiddleware,logout);

export default router;