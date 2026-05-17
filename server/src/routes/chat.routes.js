import express from "express"
import { createChat,getPreviousChats,deleteChat} from "../controllers/chat.controller.js";
import { sendMessage,getChatSessionHistory,saveMessageDoc } from "../controllers/message.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";



const router = express.Router();

router.post("/new-chat",authMiddleware,createChat);
router.post("/message",authMiddleware,sendMessage);

router.get("/previous-chats",authMiddleware,getPreviousChats);

router.get("/chat-session-history",authMiddleware,getChatSessionHistory);

router.post("/save-message-doc",authMiddleware,saveMessageDoc)

router.delete("/delete-chat",authMiddleware,deleteChat);

export default router;