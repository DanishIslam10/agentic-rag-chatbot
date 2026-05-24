export default function HamburgerButton({ isOpen, onClick }) {

    return (
        <div>

            <button
                onClick={onClick }
                className=" md:hidden fixed top-4 left-4 z-50 group flex items-center justify-center m-5 h-12 w-12 rounded-2xl border border-white/10  bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-black/30 transition-all duration-300 hover:scale-105  hover:bg-slate-800 active:scale-95">
                <div className="flex flex-col justify-center gap-[5px]">
                    <span className=" block h-[2.5px] w-6 rounded-full  bg-white transition-all duration-300 group-hover:w-5"/>

                    <span className=" block h-[2.5px] w-4 rounded-full  bg-indigo-400 transition-all duration-300 group-hover:w-6"/>

                    <span className=" block h-[2.5px] w-6 rounded-full  bg-white transition-all duration-300 group-hover:w-5 "/>
                </div>
            </button>

            {/* Overlay */}
            {
                isOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => onClick(false)}
                    />
                )
            }
        </div>
    )
}
