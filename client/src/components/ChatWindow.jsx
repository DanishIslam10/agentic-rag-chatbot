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
            flex
            h-full
            flex-col
        "
        >

            {
                messages?.length === 0 ? (

                    <div className="flex-1">
                        <EmptyChatWindow />
                    </div>

                ) : (

                    <div
                        className="
                        flex-1
                        min-h-0
                        overflow-hidden

                        rounded-2xl
                        sm:rounded-3xl
                        md:rounded-4xl

                        shadow-2xl
                        shadow-indigo-500/10

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
                    `}</style>

                        <div
                            className="
                            chat-scrollbar

                            h-full
                            overflow-y-auto

                            rounded-2xl
                            sm:rounded-[28px]

                           
                            p-4

                            

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


            <div className="mt-4 shrink-0">

                <MessageSender />

            </div>

        </div>
    );
}