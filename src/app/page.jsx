"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-6xl font-bold mb-6">
          TaskFlow Dashboard
        </h1>

        <p className="text-slate-400 text-lg mb-10">
          Manage tasks, track progress, and visualize productivity
          using Firebase-powered analytics.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="border border-slate-600 px-6 py-3 rounded-lg hover:bg-slate-800 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}