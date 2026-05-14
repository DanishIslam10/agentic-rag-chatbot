import crypto from "crypto";
import Chat from "../models/Chat.js";
import User from "../models/User.js"
import mongoose from "mongoose";

export const createChatService = async (id,title) => {

  if (!id) {
    const error = new Error("User id is required");
    error.statusCode = 400;
    throw error;
  }

  // Generate unique session id
  // This will also be used as LangGraph thread_id
  const sessionId = crypto.randomUUID();

  // Create new chat
  const chat = await Chat.create({
    sessionId,
    user: id,
    title: title || "New Chat",
    isActive: true,
  });

  // Insert new chat in the user chat list
  await User.findByIdAndUpdate(
    id,
    { $push: { chats: chat._id } },
    { new: true }
  )

  return {
    success: true,
    chat
  }

};