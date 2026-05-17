import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { addPreviousChats, removePreviousChat } from "../slices/previousChatsSlice";
import { addMessages, clearMessages, setActiveChatId, setActiveSessionId } from "../slices/messagesSlice";

export default function PreviousChats() {

    const dispatch = useDispatch();

    const { previousChats } = useSelector((state) => state.previousChats);
    const { messages, activeChatId, activeSessionId } = useSelector((state) => state.messages);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedDeleteChat, setSelectedDeleteChat] = useState(null);

    async function getPreviousChats() {

        const response = await axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/chat/previous-chats`, {
            withCredentials: true,
        });

        // console.log("Previous Chats:", response.data.chats);

        const prevChats = response.data.chats;

        dispatch(addPreviousChats(prevChats));

        return response.data.chats;
    }

    useEffect(() => {
        getPreviousChats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // console.log("Previous Chats in Redux Store:", previousChats);
    }, [previousChats])

    async function handleChatClick(chat) {
        // Logic to handle click on a previous chat item
        // For example, you can navigate to the chat page with the selected chat's sessionId
        // // console.log("Clicked on chat:", chat);

        try {

            const response = await axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/chat/chat-session-history`, {
                params: {
                    chatId: chat._id
                },
                withCredentials: true,
            });

            const chatSessionHistory = response.data.messages;

            // // console.log("Chat History for selected chat:", chatSessionHistory);

            dispatch(clearMessages());
            dispatch(addMessages(chatSessionHistory));
            dispatch(setActiveChatId(chat._id));
            dispatch(setActiveSessionId(chat.sessionId));

        } catch (error) {
            console.error("Error handling chat click:", error);
            // Handle error (e.g., show a notification)
        }
    }

    useEffect(() => {
        // console.log("Messages in Redux Store:", messages);
        // console.log("Active Chat ID:", activeChatId);
        // console.log("Active Session ID:", activeSessionId);
    }, [messages, activeChatId, activeSessionId])

    const openDeleteConfirm = (chat, event) => {
        event.stopPropagation();
        setSelectedDeleteChat(chat);
        setIsConfirmOpen(true);
    };

    const cancelDelete = () => {
        setSelectedDeleteChat(null);
        setIsConfirmOpen(false);
    };

    const confirmDelete = async () => {
        if (!selectedDeleteChat) return;

        dispatch(removePreviousChat(selectedDeleteChat._id));

        if (activeChatId === selectedDeleteChat._id) {
            dispatch(clearMessages());
            dispatch(setActiveChatId(null));
            dispatch(setActiveSessionId(null));
        }

        setSelectedDeleteChat(null);
        setIsConfirmOpen(false);

        await axios.delete(`${import.meta.env.VITE_SERVER_ENDPOINT}/chat/delete-chat`, {
            data: { chatId: selectedDeleteChat._id },
            withCredentials: true,
        });

    };

    return (
        <div className="px-2 py-2">
            <h2 className="text-lg font-semibold mb-4">Previous Chats</h2>
            {previousChats.length === 0 ? (
                <p className="text-sm text-gray-400">No previous chats found.</p>) : (
                <ul className="space-y-3">
                    {previousChats.map((chat) => (
                        <li
                            key={chat._id}
                            className={`rounded-2xl text-sm transition duration-200 ease-in-out ${activeChatId === chat._id ? 'bg-[#263A5E]' : 'bg-[#14233c] hover:bg-[#263A5E]'}`}
                        >
                            <div
                                onClick={() => handleChatClick(chat)}
                                className="flex w-full items-center justify-between gap-3 p-4 text-left cursor-pointer"
                            >
                                <span className="truncate">
                                    {chat.title.length > 20 ? `${chat.title.substring(0, 35)}...` : chat.title}
                                </span>
                                <button
                                    type="button"
                                    onClick={(event) => openDeleteConfirm(chat, event)}
                                    className="inline-flex h-9 w-9 items-center justify-center cursor-pointer rounded-full bg-white/10 text-slate-200 transition hover:bg-white/20 hover:text-white"
                                    aria-label={`Delete chat ${chat.title}`}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {isConfirmOpen && selectedDeleteChat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-[#071827]/80 backdrop-blur-sm"
                        onClick={cancelDelete}
                    />
                    <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#071827]/95 p-6 text-white shadow-2xl">
                        <h3 className="text-lg font-semibold">Delete previous chat?</h3>
                        <p className="mt-3 text-sm text-slate-300">
                            Are you sure you want to remove "<span className="font-semibold text-white">{selectedDeleteChat.title}</span>" from your previous chats? This cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={cancelDelete}
                                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="rounded-full bg-linear-to-r from-[#00d2ff] to-[#00f5d4] px-4 py-2 text-sm font-semibold text-[#042034] shadow-lg shadow-cyan-400/20 transition hover:brightness-110"
                            >
                                Delete Chat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
