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
        <div className="flex flex-col gap-4 w-full h-full bg-slate-950 px-6 py-6 text-white">

            {
                messages.length === 0 ? (
                    <EmptyChatWindow />
                ) : (

                    <div
                        className="
                        flex h-[86vh]
                        flex-col rounded-4xl border border-white/10
                        bg-white/5 p-4 shadow-2xl
                        shadow-indigo-500/10 backdrop-blur-2xl
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
                            mb-6 rounded-3xl border border-white/10
                            bg-slate-950/80 p-6 shadow-inner
                            shadow-slate-950/20
                        "
                        >
                            <h2 className="text-2xl font-semibold text-white">
                                Aurora Chat
                            </h2>

                            <p
                                className="
                                mt-2 max-w-2xl text-sm
                                leading-7 text-slate-300
                            "
                            >
                                Continue your conversation, or ask anything
                                and receive streaming AI responses in real time.
                            </p>
                        </div>

                        <div
                            className="
                            chat-scrollbar flex-1 overflow-y-auto
                            rounded-[28px] border border-white/10
                            bg-slate-950/80 p-4 shadow-inner
                        "
                        >
                            {
                                messages.map((message, index) => (
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

