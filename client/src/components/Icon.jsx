export default function Icon() {

    return (

        <div className="flex items-center gap-3 sm:gap-4">

            {/* Logo Container */}
            <div
                className="
                    relative
                    flex items-center justify-center
                    shrink-0 overflow-hidden

                    h-14 w-14
                    sm:h-18 sm:w-18
                    md:h-22 md:w-22

                    rounded-[1.8rem]

                    border border-white/10

                    bg-gradient-to-br
                    from-[#071827]
                    via-[#0f2742]
                    to-[#09111d]

                    shadow-[0_10px_30px_rgba(0,0,0,0.45)]

                    backdrop-blur-xl
                "
            >

                {/* Glow Background */}
                <div
                    className="
                        absolute inset-0
                        bg-gradient-to-br
                        from-cyan-400/20
                        via-indigo-500/10
                        to-transparent
                    "
                />

                {/* Animated Glow */}
                <div
                    className="
                        absolute
                        h-10 w-10
                        rounded-full
                        bg-cyan-400/20
                        blur-2xl
                        animate-pulse
                    "
                />

                {/* Logo */}
                <span
                    className="
                        relative z-10

                        text-3xl
                        sm:text-5xl
                        md:text-6xl

                        drop-shadow-[0_0_15px_rgba(255,255,255,0.35)]
                    "
                >
                    🌌
                </span>

            </div>

            {/* Text Content */}
            <div className="overflow-hidden">

                <h1
                    className="
                        bg-gradient-to-r
                        from-white
                        via-cyan-100
                        to-slate-300

                        bg-clip-text
                        text-transparent

                        font-extrabold
                        tracking-wide

                        text-lg
                        sm:text-2xl
                        md:text-3xl

                        truncate
                    "
                >
                    Aurora
                </h1>

                <div className="flex items-center gap-2 mt-1">

                    {/* Status Dot */}
                    <div
                        className="
                            h-2 w-2
                            rounded-full
                            bg-emerald-400
                            shadow-[0_0_10px_rgba(74,222,128,0.8)]
                            animate-pulse
                        "
                    />

                    <h2
                        className="
                            text-[11px]
                            sm:text-sm
                            md:text-base

                            font-medium
                            tracking-wide

                            text-slate-300/90

                            truncate
                        "
                    >
                        AI Assistant
                    </h2>

                </div>

            </div>

        </div>
    );
}