import { useState } from "react";
import { addMessage } from "../slices/messagesSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import { setActiveChatId, setActiveSessionId } from "../slices/messagesSlice";
import { addPreviousChat } from "../slices/previousChatsSlice";

export default function MessageSender() {

    const [message, setMessage] = useState("");

    const dispatch = useDispatch();

    const { activeChatId, activeSessionId } = useSelector((state) => state.messages);

    const sendMessageHandler = async () => {

        if (message.trim() === "") return;

        //build humanMessage object to be sent to the server
        let humanMessage = {
            chat: activeChatId,
            sessionId: activeSessionId,
            content: message,
            role: "human"
        }

        if (!activeChatId || !activeSessionId) {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/chat/new-chat`, { content: message }, {
                withCredentials: true,
            });
            const newChat = response.data.chat;
            dispatch(setActiveChatId(newChat._id));
            dispatch(setActiveSessionId(newChat.sessionId));
            dispatch(addPreviousChat(newChat));

            humanMessage.chat = newChat._id;
            humanMessage.sessionId = newChat.sessionId;
        }

        console.log("Human Message to be sent:", humanMessage);

        // saving human meessage to mongodb only 
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/chat/save-message-doc`, humanMessage, {
            withCredentials: true,
        });

        // the saved human message document returned from the server, which is then added to the redux store
        const humanMessageDoc = response?.data?.message;

        console.log("Message Send response:", humanMessageDoc);

        setMessage("");
        dispatch(addMessage(humanMessageDoc));

        console.log("Human message saved to DB and added to store, now sending to chatbot for AI response...", humanMessage);
        const aiResponse = await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/chat/message`, humanMessage, {
            withCredentials: true,
        });

        const aiMessage = aiResponse?.data?.message;

        const aiMessageResponse = await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/chat/save-message-doc`, aiMessage, {
            withCredentials: true,
        });

        const aiMessageDoc = aiMessageResponse?.data?.message;

        console.log("Message Send aiResponse:", aiResponse.data);

        dispatch(addMessage(aiMessageDoc)

        );

    };


    return (
        <div className="flex items-center gap-4">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-teal-500/30 bg-slate-50 py-3 px-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
            />
            <button
                onClick={sendMessageHandler}
                className="rounded-full bg-linear-to-r from-[#00d2ff] to-[#00f5d4] p-3 text-sm font-extrabold tracking-wide text-slate-900 shadow-[0_0_20px_rgba(0,245,212,0.35)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(0,245,212,0.55)] hover:brightness-105 active:scale-[0.98]">
                Send
            </button>
        </div>
    );
}