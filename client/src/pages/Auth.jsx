import {Show,SignInButton,SignUpButton,UserButton} from "@clerk/react";
import Logo from "../components/Logo";

export default function Auth() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] px-4 py-10 font-sans">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.35),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.35),transparent_30%),linear-gradient(to_bottom_right,#020617,#0f172a,#111827)]"></div>

      {/* Floating Glow Effects */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse"></div>

      <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl animate-pulse delay-1000"></div>

      {/* Tiny Floating Stars */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-[10%] top-[20%] text-white">✦</div>
        <div className="absolute left-[80%] top-[15%] text-cyan-300">✧</div>
        <div className="absolute left-[70%] top-[70%] text-fuchsia-300">✦</div>
        <div className="absolute left-[20%] top-[80%] text-white">✧</div>
      </div>

      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,255,255,0.08)]">

        {/* Top Gradient Border */}
        <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-blue-500"></div>

        <div className="p-8 sm:p-10">

          {/* Header */}
          <div className="flex flex-col items-center text-center">

            {/* Logo */}
            <Logo />
            

            {/* Branding */}
            <h1 className="mt-5 bg-gradient-to-r from-white via-cyan-200 to-fuchsia-200 bg-clip-text text-4xl font-black tracking-wide text-transparent">
              AURORA
            </h1>

            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-300">
              Your futuristic AI assistant for smarter conversations,
              productivity, and creativity.
            </p>
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10"></div>

            <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
              Get Started
            </span>

            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          {/* Auth Buttons */}
          <div className="flex flex-col gap-4">

            <Show when="signed-out">

              {/* Sign In Button */}
              <SignInButton mode="modal">
                <button className="group relative overflow-hidden rounded-2xl bg-white px-6 py-4 font-semibold text-slate-900 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/30">

                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                  <span className="relative z-10">
                    Sign In
                  </span>
                </button>
              </SignInButton>

              {/* Sign Up Button */}
              <SignUpButton mode="modal">
                <button className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 px-6 py-4 font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/40">

                  <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                  <span className="relative z-10">
                    Create Account
                  </span>
                </button>
              </SignUpButton>

            </Show>

            {/* Signed In */}
            <Show when="signed-in">
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/30 bg-white/10 backdrop-blur-xl">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-14 w-14",
                      },
                    }}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Welcome Back
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    You are successfully authenticated.
                  </p>
                </div>
              </div>
            </Show>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs leading-relaxed text-slate-400">
            Secure authentication powered by modern AI-grade infrastructure.
          </p>
        </div>
      </div>

      {/* Bottom Decorative Star */}
      <div className="absolute bottom-6 right-6 text-2xl text-white/30">
        ✦
      </div>
    </div>
  );
}