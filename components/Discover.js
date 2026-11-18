"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SwipeCard from "./SwipeCard";

export default function Discover() {
  const [profiles, setProfiles] = useState(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [match, setMatch] = useState(null);
  const [dir, setDir] = useState("like");
  const [flash, setFlash] = useState(null);
  const busy = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/feed")
      .then((r) => {
        if (!r.ok) throw new Error("bad response");
        return r.json();
      })
      .then((d) => {
        if (!cancelled) setProfiles(d.profiles);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  async function swipe(direction, fromButton = false) {
    if (busy.current || !profiles?.length) return;
    busy.current = true;
    const top = profiles[0];
    setDir(direction);
    setProfiles((p) => p.slice(1));

    if (fromButton) {
      setFlash(direction);
      setTimeout(() => setFlash(null), 600);
    }

    try {
      const res = await fetch("/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: top.id, direction }),
      });
      // 409 = pehle hi swipe ho chuka hai, card wapas laane ki zaroorat nahi
      if (!res.ok && res.status !== 409) throw new Error("swipe failed");
      const data = await res.json();
      if (data.match) setMatch(data.profile);
    } catch {
      setProfiles((p) => [top, ...p]);
    } finally {
      setTimeout(() => (busy.current = false), 300);
    }
  }

  // Desktop pe keyboard se swipe: ← pass, → like
  useEffect(() => {
    function onKey(e) {
      if (match) return;
      if (e.key === "ArrowRight") swipe("like", true);
      if (e.key === "ArrowLeft") swipe("pass", true);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 text-gray-500">
        <p className="text-5xl mb-3">📡</p>
        <p className="font-bold text-lg text-gray-700">Couldn&apos;t reach the server</p>
        <p className="text-sm mt-1">Make sure the API is running, then try again.</p>
        <button
          onClick={() => {
            setError(false);
            setAttempt((a) => a + 1);
          }}
          className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-full font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profiles) {
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="relative flex-1 min-h-0 mx-3 mt-3">
        {profiles.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-500 px-6">
            <p className="text-6xl mb-3">🎉</p>
            <p className="font-bold text-xl text-gray-700">You&apos;re all caught up</p>
            <p className="text-sm mt-1">No more profiles right now. Check back later.</p>
          </div>
        ) : (
          <AnimatePresence custom={dir}>
            <SwipeCard key={profiles[0].id} profile={profiles[0]} onSwipe={swipe} />
          </AnimatePresence>
        )}

        <AnimatePresence>
          {flash && (
            <motion.div
              key={flash}
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className={`border-8 rounded-2xl px-6 py-2 text-6xl font-extrabold -rotate-12 bg-white/70 ${
                  flash === "like"
                    ? "border-green-500 text-green-500"
                    : "border-red-500 text-red-500"
                }`}
              >
                {flash === "like" ? "LIKE" : "NOPE"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {profiles.length > 0 && (
        <div className="flex justify-center items-center gap-10 py-3 shrink-0">
          <button
            onClick={() => swipe("pass", true)}
            aria-label="Pass"
            className="w-14 h-14 rounded-full bg-white shadow-lg border border-red-100 text-2xl text-red-500 active:scale-90 transition"
          >
            ✕
          </button>
          <button
            onClick={() => swipe("like", true)}
            aria-label="Like"
            className="w-14 h-14 rounded-full bg-white shadow-lg border border-green-100 text-2xl text-green-500 active:scale-90 transition"
          >
            ♥
          </button>
        </div>
      )}

      {match && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white p-6"
          style={{ background: "linear-gradient(135deg, #ec4899, #f97316)" }}
        >
          <h1 className="text-5xl font-extrabold mb-2 italic">It&apos;s a match!</h1>
          <p className="mb-6 text-lg">You and {match.name} liked each other</p>
          <img
            src={match.photo}
            alt={match.name}
            className="w-44 h-44 rounded-full object-cover border-4 border-white shadow-xl"
          />
          <button
            onClick={() => setMatch(null)}
            className="mt-8 bg-white text-pink-500 px-8 py-3 rounded-full font-bold"
          >
            Keep swiping
          </button>
        </div>
      )}
    </div>
  );
}