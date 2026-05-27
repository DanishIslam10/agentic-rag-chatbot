import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import { setActiveChatId, setActiveSessionId, addMessage, updateMessage, replaceMessage, setStreamingMessageId } from "../slices/messagesSlice";
import { addPreviousChat } from "../slices/previousChatsSlice";
import { SendHorizontal } from 'lucide-react';
import { useAuth } from '@clerk/react';

export default function MessageSender() {

    const [message, setMessage] = useState("");

    const { getToken } = useAuth();
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

        const token = await getToken();

        // console.log("Clerk token obtained in MessageSender:", token);

        if (!activeChatId || !activeSessionId) {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/chat/new-chat`, { content: message }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const newChat = response.data.chat;
            dispatch(setActiveChatId(newChat?._id));
            dispatch(setActiveSessionId(newChat?.sessionId));
            dispatch(addPreviousChat(newChat));

            humanMessage.chat = newChat?._id;
            humanMessage.sessionId = newChat?.sessionId;
        }

        // console.log("Human Message to be sent:", humanMessage);

        // saving human meessage to mongodb only 
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/chat/save-message-doc`, humanMessage, {
            headers: {
                Authorization: `Bearer ${token}`
            }
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

        dispatch(setStreamingMessageId(tempAiMessage?._id))

        // console.log("Temp AI Message created and added to store, now sending human message to chatbot for AI response...", tempAiMessage);

        dispatch(addMessage(tempAiMessage));

        // console.log("Human message saved to DB and added to store, now sending to chatbot for AI response...", humanMessage);

        try {


            const token = await getToken();

            const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/chat/message`;

            console.log("Sending message to chatbot at URL:", url);

            const aiResponse = await fetch(url, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },

                body: JSON.stringify(humanMessage),
            }
            );

            const reader = aiResponse.body.getReader();

            const decoder = new TextDecoder();

            let aiText = "";
            let buffer = "";
            let pendingText = "";

            while (true) {

                const { done, value } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                const events = buffer.split("\n\n");

                buffer = events.pop();

                for (const event of events) {

                    const lines = event.split("\n");

                    for (const line of lines) {

                        if (line.startsWith("data: ")) {

                            const jsonText = line.slice(6);

                            if (jsonText === "[DONE]") continue;

                            const text = JSON.parse(jsonText);

                            pendingText += text;
                        }
                    }
                }

                // update UI less frequently
                if (pendingText.length > 5) {

                    aiText += pendingText;

                    pendingText = "";

                    dispatch(updateMessage({
                        _id: tempAiMessage?._id,
                        content: aiText
                    }));
                }
            }

            // flush remaining text
            if (pendingText) {

                aiText += pendingText;

                dispatch(updateMessage({
                    _id: tempAiMessage?._id,
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
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            dispatch(replaceMessage({
                _id: tempAiMessage?._id,
                newMessage: aiMessageResponse.data.message
            }));

            dispatch(setStreamingMessageId(null));

        } catch (error) {
            console.error("Error in sending message to chatbot or receiving response:", error);
            dispatch(updateMessage({
                _id: tempAiMessage?._id,
                content: "Error in getting response from AI. Please try again."
            }));
            dispatch(setStreamingMessageId(null));
        }

        // console.log("Message Send aiResponse:", aiMessageResponse.data.message);
    };


    return (
        <div
            className="
        relative
        flex items-end
        mb-3
        rounded-3xl
        border border-white/10
        bg-slate-900/80
        px-4
        py-3
        mx-4
        shadow-inner
        backdrop-blur-xl
        transition-all duration-300
        focus-within:border-cyan-400/40
        focus-within:shadow-cyan-500/10
    "
        >

            <textarea
                value={message}

                onChange={(e) => {

                    setMessage(e.target.value);

                    // reset height first
                    e.target.style.height = "auto";

                    // set new height
                    e.target.style.height =
                        Math.min(e.target.scrollHeight, 160) + "px";
                }}

                onKeyDown={(e) => {

                    if (e.key === "Enter" && !e.shiftKey) {

                        e.preventDefault();

                        sendMessageHandler();
                    }
                }}

                rows={1}

                placeholder="Message Aurora..."

                className="
            w-full
            resize-none
            overflow-y-auto
            bg-transparent
            pr-16
            text-sm
            text-white
            placeholder:text-slate-400
            outline-none
            leading-6

            min-h-6
            max-h-40

            scrollbar-thin
        "
            />

            <button
                onClick={sendMessageHandler}

                className="
            absolute
           
            right-3
            bottom-0

            p-2
            m-2
            mr-0

            cursor-pointer
 
            items-center
            justify-center

            rounded-full

            bg-linear-to-r
            from-cyan-400
            via-teal-300
            to-emerald-300

            text-slate-900

            transition-all
            duration-100

            hover:scale-105
            active:scale-95
        "
            >
                <SendHorizontal size={20} />
            </button>

        </div>
    );
}