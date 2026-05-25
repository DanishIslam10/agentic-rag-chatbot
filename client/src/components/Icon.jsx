import Logo from "./Logo";

export default function Icon() {

    return (

        <div className="flex items-center gap-3 sm:gap-4">

            <Logo />

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