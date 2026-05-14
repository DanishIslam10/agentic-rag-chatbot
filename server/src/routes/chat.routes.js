import express from "express"
import { createChat } from "../controllers/chat.controller.js";
import { sendMessage } from "../controllers/message.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/new",authMiddleware,createChat);
router.post("/message",authMiddleware,sendMessage);

export default router;