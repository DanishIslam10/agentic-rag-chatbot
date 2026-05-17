import { Plus } from 'lucide-react';
import { useDispatch } from "react-redux";
import { clearMessages, setActiveChatId, setActiveSessionId } from "../slices/messagesSlice";

export default function NewChatButton() {
  const dispatch = useDispatch();

  function newChatHandler() {
    dispatch(clearMessages());
    dispatch(setActiveChatId(null));
    dispatch(setActiveSessionId(null));
  }


  return (
    <div className="w-full p-2 bg-slate-950/20 rounded-2xl"> {/* Contextual container helper */}
      <button
        onClick={newChatHandler}
        className="group relative flex w-full items-center justify-center gap-2 cursor-pointer rounded-2xl bg-linear-to-r from-[#00d2ff] to-[#00f5d4] py-3.5 text-sm font-extrabold tracking-wide text-slate-900 shadow-[0_0_20px_rgba(0,245,212,0.35)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(0,245,212,0.55)] hover:brightness-105 active:scale-[0.98]"
      >
        {/* Subtle internal gloss overlay on hover */}
        <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        {/* Plus Icon with rotation effect */}
        <Plus
          size={18}
          className="stroke-3 transition-transform duration-300 ease-out group-hover:rotate-90"
        />

        <span >New Chat</span>
      </button>
    </div>
  );

}
