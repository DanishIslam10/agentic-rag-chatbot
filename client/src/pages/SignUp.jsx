import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    console.log("Form Submitted:", formData);

    const SERVER_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT;

    const url = `${SERVER_ENDPOINT}/auth/signup`;

    const response = await axios.post(url, formData, {
      withCredentials: true,
    });

    console.log("Server Response:", response);

    if (response.status === 201) {
      toast.success("Account created successfully!");
    }
  }
  catch (error) {

    console.log(error);

    // backend custom error message
    const message =
      error.response?.data?.message ||
      "Something went wrong";

    toast.error(message);
  }
};

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-tr from-[#9b5de5] via-[#00f5d4] to-[#00bbf9] px-4 font-sans">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-purple-400 opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-300 opacity-25 blur-3xl animate-pulse delay-1000"></div>

      {/* Main Glassmorphic Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/40 bg-white/85 p-8 shadow-2xl backdrop-blur-md">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-b from-slate-900 to-indigo-950 shadow-lg shadow-indigo-950/40">
            {/* Aurora Glow Effect around Avatar */}
            <div className="absolute inset-0 rounded-full bg-cyan-400/40 blur-md animate-pulse"></div>
            {/* Synthetic Northern Lights Icon Placeholder */}
            <span className="relative text-2xl">🌌</span>
          </div>
          
          <h1 className="mt-3 text-2xl font-black tracking-wider text-slate-800">AURORA</h1>
          <p className="text-xs font-medium tracking-wide text-slate-500">AI Assistant</p>
          
          <h2 className="mt-6 text-xl font-bold text-slate-800">Create Your Account</h2>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          {/* Full Name Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <User size={18} />
            </span>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-full border border-teal-500/30 bg-slate-50 py-3 pr-4 pl-11 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <Mail size={18} />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-3 pr-4 pl-11 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
              required
            />
          </div>

          {/* Password Rows */}
          <div className="">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <Lock size={16} />
              </span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-full border border-slate-300 bg-slate-50 py-3 pr-4 pl-11 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
                required
              />
            </div>
            
            {/* <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <Lock size={16} />
              </span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-full border border-slate-300 bg-slate-50 py-3 pr-4 pl-11 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
                required
              />
            </div> */}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-cyan-400 to-cyan-500 py-3 text-sm font-bold text-slate-800 shadow-lg shadow-cyan-400/30 transition-all hover:brightness-105 active:scale-[0.98]"
          >
            Sign Up <ArrowRight size={16} />
          </button>
        </form>

        {/* Divider */}
        {/* <div className="relative my-6 flex items-center justify-center">
          <div className="absolute w-full border-t border-slate-200"></div>
          <span className="relative bg-white/0 px-3 text-xs font-medium text-slate-400 backdrop-blur-sm">
            or sign up with
          </span>
        </div> */}

        {/* OAuth Social Buttons */}
        {/* <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.6 2.8C6.01 7.22 8.79 5.04 12 5.04z"/>
              <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.6-.2-2.35H12v4.45h6.45c-.28 1.47-1.11 2.71-2.36 3.55l3.6 2.8c2.1-1.94 3.31-4.8 3.31-8.45z"/>
              <path fill="#FBBC05" d="M5.1 14.7c-.23-.7-.35-1.44-.35-2.2s.12-1.5.35-2.2L1.5 7.5C.54 9.4 0 11.64 0 12s.54 2.6 1.5 4.5l3.6-2.8z"/>
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.6-2.8c-1.1.74-2.52 1.18-4.36 1.18-3.21 0-5.99-2.18-6.9-5.26l-3.6 2.8C3.39 20.35 7.35 23 12 23z"/>
            </svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]">
            <svg className="h-4 w-4 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94 1.07.08 2.16-.52 2.82-1.33z"/>
            </svg>
            Apple
          </button>
        </div> */}

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs font-semibold text-slate-500">
          Already have an account?{' '}
          <a href="/login" className="text-teal-500 transition-all hover:underline">
            Log In
          </a>
        </div>

      </div>
      
      {/* Aesthetic Star/Sparkle Decor on bottom right corner */}
      <div className="absolute bottom-6 right-6 text-white/40 text-2xl select-none">✦</div>
    </div>
  );
}