import { Sparkles, Bot, Stars } from "lucide-react";

export default function Logo() {
    return (
        <div className="relative flex h-20 w-20 my-4 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-600 via-violet-600 to-cyan-500 shadow-2xl shadow-cyan-500/30">

            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-cyan-400/30 blur-xl"></div>

            {/* Icon */}
            <div className="relative">
                <Bot className="h-9 w-9 text-white" />
            </div>

            {/* Floating Sparkles */}
            <Sparkles className="absolute -right-2 -top-2 h-5 w-5 text-cyan-200 animate-pulse" />

            <Stars className="absolute -bottom-2 -left-2 h-4 w-4 text-fuchsia-200 animate-pulse" />
        </div>
    )
}