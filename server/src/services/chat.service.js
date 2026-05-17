import crypto from "crypto";
import Chat from "../models/Chat.js";
import User from "../models/User.js"
import Message from "../models/Message.js";
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

  return chat;

};


export const getPreviousChatsService = async (id) => {

  if (!id) {
    const error = new Error("User id is required");
    error.statusCode = 400;
    throw error;
  }

  const chats = await Chat.find({ user: id }).sort({ createdAt: -1 });

  return chats;

};


export const deleteChatService = async (userId, chatId) => {

  if (!userId) {  
    const error = new Error("User id is required");
    error.statusCode = 400;
    throw error;
  }

  if (!chatId) {
    const error = new Error("Chat id is required");
    error.statusCode = 400;
    throw error;
  }

  // Delete the chat document from the Chat collection
  await Chat.findOneAndDelete({ _id: chatId, user: userId });

  // Delete all messages associated with the chat
  await Message.deleteMany({ chat: chatId });

  // Remove the chat reference from the user's chat list
  await User.findByIdAndUpdate(
    userId,
    { $pull: { chats: chatId } },
    { new: true }
  );

  return;

}