import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import { setActiveChatId, setActiveSessionId, addMessage, updateMessage, replaceMessage, setStreamingMessageId } from "../slices/messagesSlice";
import { addPreviousChat } from "../slices/previousChatsSlice";
import { SendHorizontal } from 'lucide-react';

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

        // console.log("Human Message to be sent:", humanMessage);

        // saving human meessage to mongodb only 
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/chat/save-message-doc`, humanMessage, {
            withCredentials: true,
        });

        // the saved human message document returned from the server, which is then added to the redux store
        const humanMessageDoc = response?.data?.message;

        ("Message Send response:", humanMessageDoc);

        setMessage("");
        dispatch(addMessage(humanMessageDoc));

        const tempAiMessage = {
            _id: Math.random().toString(36).substring(2, 15), // generate a random id for the temp AI message
            chat: humanMessage.chat,
            sessionId: humanMessage.sessionId,
            role: "ai",
            content: ""
        };

        dispatch(setStreamingMessageId(tempAiMessage._id))

        // console.log("Temp AI Message created and added to store, now sending human message to chatbot for AI response...", tempAiMessage);

        dispatch(addMessage(tempAiMessage));

        // console.log("Human message saved to DB and added to store, now sending to chatbot for AI response...", humanMessage);

        try {


            const aiResponse = await fetch(
                `${import.meta.env.VITE_SERVER_ENDPOINT}/chat/message`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(humanMessage),
                }
            );

            const reader = aiResponse.body.getReader();

            const decoder = new TextDecoder();

            let aiText = "";

            while (true) {

                const { done, value } = await reader.read();

                if (done) break;


                const chunk = decoder.decode(value);

                // console.log("Received chunk from chatbot:", chunk);

                aiText += chunk;

                dispatch(updateMessage({
                    _id: tempAiMessage._id,
                    content: aiText
                }));
            }

            //  console.log("Full AI response received from chatbot:", aiText);

            const aiMessageObj = {
                chat: humanMessage.chat,
                sessionId: humanMessage.sessionId,
                role: "ai",
                content: aiText
            }

            const aiMessageResponse = await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/chat/save-message-doc`, aiMessageObj, {
                withCredentials: true,
            });

            dispatch(replaceMessage({
                _id: tempAiMessage._id,
                newMessage: aiMessageResponse.data.message
            }));

            dispatch(setStreamingMessageId(null));

        } catch (error) {
            console.error("Error in sending message to chatbot or receiving response:", error);
            dispatch(updateMessage({
                _id: tempAiMessage._id,
                content: "Error in getting response from AI. Please try again."
            }));
            dispatch(setStreamingMessageId(null));
        }

        // console.log("Message Send aiResponse:", aiMessageResponse.data.message);
    };


    return (
        <div className="relative flex items-center rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 shadow-inner backdrop-blur-xl transition-all duration-300 focus-within:border-cyan-400/40 focus-within:shadow-cyan-500/10">

            <input
                type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message Aurora..."
                className=" flex-1 bg-transparent pr-14 text-sm text-white  placeholder:text-slate-50 outline-none"
            />

            <button onClick={sendMessageHandler} className=" group absolute right-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r  from-cyan-400  via-teal-300  to-emerald-300  text-slate-900 shadow-lg  shadow-cyan-500/20  transition-all duration-300  hover:-translate-y-0.5  hover:shadow-cyan-400/40  active:scale-95">

                <span className=" absolute inset-0 rounded-2xl  bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 " />

                <SendHorizontal size={18} className="relative z-10" />

            </button>

        </div>
    );
}