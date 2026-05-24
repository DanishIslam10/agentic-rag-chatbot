import Sidebar from "../components/Sidebar";
import ChatWindow from '../components/ChatWindow';

export default function ChatPage() {
  return (
    <div className="flex w-full h-screen">
      <div className="">
        <Sidebar />
      </div>
      <div className="w-full">
        <ChatWindow />
      </div>
    </div>
  );
}