import { LogOut, X } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Dimmed Backdrop with Blur - match app's dark teal theme */}
      <div
        className="absolute inset-0 bg-[#071827]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Logout Card Container - dark translucent with teal accents */}
      <div className="relative w-full max-w-sm transform rounded-3xl border border-[#122138]/30 bg-[#071827]/90 p-6 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95 duration-200 text-white">

        {/* Glow Element under the modal (teal-indigo) */}
        <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-r from-[#0ea5a4]/10 via-[#7c3aed]/6 to-[#122138]/10 blur-xl"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Close logout modal"
        >
          <X size={18} />
        </button>

        {/* Header Content */}
        <div className="flex flex-col items-center text-center">
          {/* Animated Logout Icon Container - themed */}
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#082235] to-[#092233] shadow-md">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00f5d4]/20 via-[#7c3aed]/10 to-[#122138]/10 blur-sm animate-pulse"></div>
            <LogOut size={22} className="relative text-white" />
          </div>

          <h3 className="mt-4 text-lg font-bold text-white">Signing out?</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-300 max-w-[260px]">
            Are you sure you want to log out of your <span className="font-bold text-white">Aurora AI</span> session?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-transparent py-2.5 text-xs font-bold text-white/90 shadow-sm transition-all hover:bg-white/5 active:scale-[0.98]"
          >
            Stay Logged In
          </button>

          {/* Confirm Logout Button */}
          <button
            onClick={onConfirm}
            className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#00d2ff] to-[#00f5d4] py-2.5 text-xs font-bold text-[#042034] shadow-lg shadow-cyan-400/20 transition-all hover:brightness-105 active:scale-[0.98]"
          >
            Yes, Log Out
          </button>
        </div>

      </div>
    </div>
  );
}