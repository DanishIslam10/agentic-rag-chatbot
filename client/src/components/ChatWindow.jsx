import { useSelector } from "react-redux";
import DisplayMessages from "./DisplayMessages";
import MessageSender from "./MessageSender";

export default function ChatWindow() {

    const { messages } = useSelector((state) => state.messages);

    return (
        <div className="flex flex-col p-6 h-screen bg-[#DDFAF4]">
            <style>{`
                .chat-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #122138 transparent;
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
                    background: #122138;
                    border-radius: 9999px;
                    border: 3px solid rgba(0,0,0,0);
                    background-clip: padding-box;
                    box-shadow: 0 2px 8px rgba(18,33,56,0.12) inset;
                }

                .chat-scrollbar::-webkit-scrollbar-thumb:hover {
                    filter: brightness(1.06);
                }

                .chat-scrollbar::-webkit-scrollbar-corner { background: transparent; }
            `}</style>
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto mb-6 rounded-lg p-4 chat-scrollbar">
                {/* Messages will be displayed here */}
                {
                    messages.map((message, index) => (
                       <DisplayMessages key={index} message={message} />
                    ))
                }
            </div>

            {/* Input area */}
            <MessageSender/>

        </div>
    );
}

