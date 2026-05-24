import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Icon from './Icon';
import LogoutModal from './LogoutModal';
import NewChatButton from './NewChatBtn';
import PreviousChats from './PreviousChats';
import HamburgerButton from './HamburgerButton';
import { logout } from '../slices/authSlice';

export default function Sidebar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const SERVER_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT;
            const url = `${SERVER_ENDPOINT}/auth/logout`;

            await axios.get(url, {
                withCredentials: true,
            });

            setIsModalOpen(false);
            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <>
            {/* Mobile Hamburger Button */}
            <HamburgerButton
                isOpen={isSidebarOpen}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* Sidebar */}
            <div
                className={`
    fixed md:relative top-0 left-0 z-50
    w-[78vw] sm:w-[320px] md:w-[25vw]
    h-screen
    text-white
    overflow-hidden
    p-4

    bg-gradient-to-b
    from-[#071827]
    via-[#0b1f35]
    to-[#09111d]

    border-r border-white/10
    shadow-[0_0_40px_rgba(0,0,0,0.45)]

    backdrop-blur-2xl

    transform transition-all duration-300 ease-in-out
    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0
`}
            >
                <style>{`
                    .sidebar-scrollbar {
                        scrollbar-width: thin;
                        scrollbar-color: rgba(2, 59, 108, 0.9) transparent;
                    }

                    .sidebar-scrollbar::-webkit-scrollbar {
                        width: 10px;
                    }

                    .sidebar-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                        border-radius: 9999px;
                        margin: 8px 0;
                    }

                    .sidebar-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(2, 59, 108, 0.92);
                        border-radius: 9999px;
                        border: 2px solid rgba(255, 255, 255, 0.06);
                        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
                    }

                    .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(2, 59, 108, 1);
                    }
                `}</style>

                {/* Background Glow Effects */}

                <div
                    className="
        absolute -top-24 -left-24
        h-64 w-64
        rounded-full
        bg-cyan-500/10
        blur-3xl
    "
                />

                <div
                    className="
        absolute top-1/3 -right-20
        h-72 w-72
        rounded-full
        bg-indigo-500/10
        blur-3xl
    "
                />

                <div
                    className="
        absolute bottom-0 left-1/3
        h-52 w-52
        rounded-full
        bg-sky-400/5
        blur-3xl
    "
                />

                {/* Noise Overlay */}
                <div
                    className="
        pointer-events-none
        absolute inset-0
        opacity-[0.04]
        mix-blend-soft-light
        bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]
    "
                />

                <div
                    className="
        relative z-10
        flex flex-col h-full
        overflow-y-auto
        pr-2
        sidebar-scrollbar
    "
                >
                    {/* Top Section */}
                    <div className="flex items-center justify-between">
                        <Icon />
                        <div className="flex items-center gap-2">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className=" md:hidden group flex items-center justify-center h-11 w-11 rounded-2xl border border-white/10  bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-black/30 transition-all duration-300 hover:scale-105  hover:bg-red-500/20 active:scale-95">
                                <span
                                    className="
                                        text-xl font-light text-white
                                        transition-transform duration-300
                                        group-hover:rotate-90
                                    "
                                >
                                    ✕
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* New Chat Button */}
                    <div className="flex justify-center my-6">
                        <NewChatButton />
                    </div>

                    {/* Previous Chats */}
                    <div className="flex-1">
                        <PreviousChats />
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm transition duration-200 ease-in-out hover:bg-slate-700 hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <LogoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleLogout}
            />
        </>
    );
}
