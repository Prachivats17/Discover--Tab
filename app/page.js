"use client";
import { useState } from "react";
import Discover from "@/components/Discover";
import Matches from "@/components/Matches";

const ICONS = {
  Home: (
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  ),
  Discover: (
    <>
      <rect x="4" y="5" width="13" height="16" rx="3" />
      <path d="M8 3h9a3 3 0 0 1 3 3v11" />
    </>
  ),
  Matches: (
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z" />
  ),
};

const TABS = ["Home", "Discover", "Matches"];

export default function App() {
  const [tab, setTab] = useState("Discover");

  return (
    <div className="bg-pink-100/70 min-h-[100dvh] flex items-center justify-center">
      <main className="select-none w-full max-w-md h-[100dvh] sm:h-[92vh] sm:max-h-[820px] bg-white flex flex-col sm:shadow-2xl sm:shadow-pink-900/15 sm:rounded-[2rem] overflow-hidden sm:border border-pink-200">
        <header className="py-3 flex items-center justify-center gap-1.5 bg-white z-10 border-b border-pink-100">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
          <span className="text-2xl font-black tracking-tight text-pink-600">discover</span>
        </header>

        <section className="flex-1 min-h-0 flex flex-col overflow-hidden relative bg-gradient-to-b from-pink-50/70 via-rose-50/50 to-pink-100/60">
          {tab === "Home" && <div />}
          {tab === "Discover" && <Discover />}
          {tab === "Matches" && (
            <div className="flex-1 overflow-y-auto">
              <Matches />
            </div>
          )}
        </section>

        <nav className="flex border-t border-pink-100 bg-white pt-2 pb-3 px-4 justify-around items-center z-10">
          {TABS.map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex flex-col items-center gap-0.5 text-[11px] font-semibold transition ${
                  active ? "text-pink-600" : "text-gray-400 hover:text-pink-400"
                }`}
              >
                <span
                  className={`px-5 py-1 rounded-full transition ${
                    active ? "bg-pink-500 text-white shadow-sm shadow-pink-500/30" : "bg-transparent"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {ICONS[t]}
                  </svg>
                </span>
                {t}
              </button>
            );
          })}
        </nav>
      </main>
    </div>
  );
}