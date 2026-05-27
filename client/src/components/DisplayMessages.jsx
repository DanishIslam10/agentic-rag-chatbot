import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function DisplayMessage({
    message,
    streamingMessageId
}) {

    const isAiMessage = message?.role === "ai";

    const isStreaming =
        isAiMessage &&
        streamingMessageId === message?._id;

    return (

        <div
            className={`
                mb-4 flex w-full
                ${message?.role === "human"
                    ? "justify-end"
                    : "justify-start"
                }
            `}
        >

            <div
                className="
                    flex min-w-0 md:max-w-[75%]
                    flex-col gap-3
                "
            >

                {
                    isAiMessage && (
                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    aurora-logo relative
                                    inline-flex h-12 w-12
                                    items-center justify-center
                                "
                            >
                                <div
                                    className="
                                        absolute inset-0 rounded-full
                                        bg-linear-to-br
                                        from-indigo-500
                                        via-purple-500
                                        to-pink-400
                                        opacity-90
                                    "
                                />

                                <div
                                    className="
                                        absolute inset-1 rounded-full
                                        bg-slate-950/20 backdrop-blur-sm
                                    "
                                />

                                <span
                                    role="img"
                                    aria-label="aurora"
                                    title="Aurora"
                                    className="relative z-10 text-lg"
                                >
                                    ✨
                                </span>

                            </div>

                            {
                                isStreaming && (
                                    <div
                                        className="
                                            flex items-center gap-2
                                            rounded-3xl border border-white/10
                                            bg-[#17ADA1]/15
                                            px-4 py-3 text-sm md:text-md text-white
                                            shadow-inner shadow-slate-950/10
                                        "
                                    >
                                        <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />

                                        <span
                                            className="h-2.5 w-2.5 rounded-full bg-white animate-pulse"
                                            style={{ animationDelay: "0.15s" }}
                                        />

                                        <span
                                            className="h-2.5 w-2.5 rounded-full bg-white animate-pulse"
                                            style={{ animationDelay: "0.3s" }}
                                        />

                                        <span className="text-white/80">
                                            Aurora is typing...
                                        </span>

                                    </div>
                                )
                            }

                        </div>
                    )
                }

                {
                    message?.content !== "" && (

                        <div
                            className={`
                                min-w-0 max-w-full
                                overflow-hidden
                                rounded-3xl border border-white/10
                                px-5 py-5 shadow-xl
                                text-sm md:text-md
                                shadow-slate-950/10
                                backdrop-blur-xl
                                ${message?.role === "human"
                                    ? "bg-[#1249B0] text-white"
                                    : "bg-slate-950/80 text-slate-100"
                                }
                            `}
                        >

                            {
                                isAiMessage && isStreaming ? (

                                    <div className="markdown-content streaming-content">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                        >
                                            {message?.content}
                                        </ReactMarkdown>
                                    </div>

                                ) : (

                                    <div className="markdown-content">

                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                        >
                                            {message?.content}
                                        </ReactMarkdown>

                                    </div>

                                )
                            }

                        </div>
                    )
                }

            </div>

        </div>
    );
}