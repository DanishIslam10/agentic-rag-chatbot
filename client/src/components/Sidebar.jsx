import { LogOut } from 'lucide-react';
import Icon from './Icon';
import LogoutModal from './LogoutModal';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import axios from 'axios';
import NewChatButton from './NewChatBtn'
import PreviousChats from './PreviousChats';

export default function Sidebar() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleLogout = async () => {

        try {

            const SERVER_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT;

            const url = `${SERVER_ENDPOINT}/auth/logout`;

            await axios.get(url, {
                withCredentials: true,
            });

            // console.log("Logged o  ut cleanly.");
            setIsModalOpen(false);
            dispatch(logout());
            navigate('/');

        } catch (error) {
            console.error("Error during logout:", error);
            // Handle error (e.g., show a notification)
        }

    };

    return (
        <div className="relative bg-[#122138] text-white h-screen p-4 overflow-hidden">
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
                    border: 2px solid rgba(255,255,255,0.06);
                    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
                }

                .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(2, 59, 108, 1);
                }
            `}</style>

            <div className="flex flex-col h-full overflow-y-auto pr-2 sidebar-scrollbar">
                <div className="flex gap-4 justify-between">
                    <Icon />
                    <div className="p-2">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm transition duration-200 ease-in-out hover:bg-slate-700 hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            Logout
                        </button>

                        <LogoutModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onConfirm={handleLogout}
                        />
                    </div>
                </div>
                <div className="flex justify-center my-8">
                    <NewChatButton />
                </div>
                <PreviousChats />
            </div>
        </div>
    );
}
