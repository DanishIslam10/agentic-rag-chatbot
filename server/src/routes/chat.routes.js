import express from "express"
import { createChat,getPreviousChats,deleteChat} from "../controllers/chat.controller.js";
import { sendMessage,getChatSessionHistory,saveMessageDoc } from "../controllers/message.controller.js";
import { clerkMiddleware,requireAuth } from "@clerk/express";


const router = express.Router();

router.use(clerkMiddleware());

router.post("/new-chat",requireAuth(),createChat);
router.post("/message",requireAuth(),sendMessage);

router.get("/previous-chats",requireAuth(),getPreviousChats);

router.get("/chat-session-history",requireAuth(),getChatSessionHistory);

router.post("/save-message-doc",requireAuth(),saveMessageDoc)

router.delete("/delete-chat",requireAuth(),deleteChat);

export default router;