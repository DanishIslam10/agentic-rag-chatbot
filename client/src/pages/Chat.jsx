import Sidebar from "../components/Sidebar";
import ChatWindow from '../components/ChatWindow';

export default function ChatPage() {
  return (
    <div className="flex w-full h-screen">
      <div className="w-[25vw]">
        <Sidebar />
      </div>
      <div className="w-[75vw] h-screen">
        <ChatWindow />
      </div>
    </div>
  );
}