import { Sparkles } from "lucide-react";

export default function EmptyChatWindow() {
    return (
        <div className="flex w-full items-center justify-center bg-slate-950 px-6 py-12 text-center text-white">
            <div className="w-full max-w-5xl">
                <div className="mb-6 mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-400 shadow-xl shadow-purple-500/20">
                    <Sparkles className="h-10 w-10 text-white" />
                </div>

                <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">
                    Welcome to Aurora
                </h1>

                <p className="mx-auto max-w-xl text-sm leading-7 text-slate-300">
                    Ask questions, analyze documents, generate ideas,
                    or start a conversation with your AI assistant.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-md transition duration-300 hover:bg-white/10">
                        <h3 className="mb-2 font-medium text-white">Summarize PDFs</h3>
                        <p className="text-sm text-slate-300">Upload documents and ask questions instantly.</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-md transition duration-300 hover:bg-white/10">
                        <h3 className="mb-2 font-medium text-white">Generate Content</h3>
                        <p className="text-sm text-slate-300">Create blogs, emails, notes, and ideas faster.</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-md transition duration-300 hover:bg-white/10">
                        <h3 className="mb-2 font-medium text-white">Research Topics</h3>
                        <p className="text-sm text-slate-300">Explore concepts with contextual AI assistance.</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-md transition duration-300 hover:bg-white/10">
                        <h3 className="mb-2 font-medium text-white">Chat Naturally</h3>
                        <p className="text-sm text-slate-300">Have fluid conversations with streaming responses.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}