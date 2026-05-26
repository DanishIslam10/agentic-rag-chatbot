import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import DisplayMessages from "./DisplayMessages";
import MessageSender from "./MessageSender";
import EmptyChatWindow from "./EmptyChatWindow";

export default function ChatWindow() {

    const { messages, streamingMessageId } = useSelector((state) => state.messages);
    const messagesEndRef = useRef(null);

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: streamingMessageId
                ? "auto"
                : "smooth"
        });

    }, [messages, streamingMessageId]);

    return (
        <div
            className="
                flex flex-col justify-between h-full gap-4 md:p-4
            "
        >

            {
                messages?.length === 0 ? (
                    <EmptyChatWindow />
                ) : (

                    <div
                        className="
                            flex h-[90vh] md:h-[85vh]
                            flex-col
                            rounded-2xl sm:rounded-3xl md:rounded-4xl   
                            shadow-2xl shadow-indigo-500/10
                            backdrop-blur-2xl
                        "
                    >

                        <style>{`
                            .chat-scrollbar {
                                scrollbar-width: thin;
                                scrollbar-color: #94a3b8 transparent;
                            }

                            .chat-scrollbar::-webkit-scrollbar {
                                width: 10px;
                            }

                            .chat-scrollbar::-webkit-scrollbar-track {
                                background: transparent;
                                border-radius: 9999px;
                                margin: 6px 0;
                            }

                            .chat-scrollbar::-webkit-scrollbar-thumb {
                                background: rgba(148,163,184,0.35);
                                border-radius: 9999px;
                                border: 3px solid rgba(255,255,255,0.05);
                                background-clip: padding-box;
                            }

                            .chat-scrollbar::-webkit-scrollbar-thumb:hover {
                                filter: brightness(1.1);
                            }

                            .chat-scrollbar::-webkit-scrollbar-corner {
                                background: transparent;
                            }
                        `}</style>

                       

                        <div
                            className="
                                chat-scrollbar flex-1 overflow-y-auto
                                rounded-2xl sm:rounded-[28px]
                                border border-white/10
                                bg-slate-950/80
                                p-3 sm:p-4
                                shadow-inner
                            "
                        >
                            {
                                messages?.map((message, index) => (
                                    <DisplayMessages
                                        key={index}
                                        message={message}
                                        streamingMessageId={streamingMessageId}
                                    />
                                ))
                            }

                            <div ref={messagesEndRef} />
                        </div>

                    </div>
                )
            }

            <MessageSender />

        </div>
    );
}