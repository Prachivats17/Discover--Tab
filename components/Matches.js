"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

export default function Matches() {
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    fetch("/matches") // Agar Express use kar rahe hain toh "/matches", nahi toh "/api/matches"
      .then((r) => r.json())
      .then((d) => setMatches(d.matches));
  }, []);

  if (!matches) return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  if (matches.length === 0)
    return <p className="text-center mt-20 text-gray-500 px-6">No matches yet. Keep swiping!</p>;

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {matches.map((m) => (
        <div key={m.id} className="rounded-2xl overflow-hidden shadow bg-white">
          <img src={m.photo} alt={m.name} className="w-full aspect-square object-cover" />
          <div className="p-2">
            <p className="font-semibold">{m.name}, {m.age}</p>
            <p className="text-xs text-gray-500">{m.place}</p>
          </div>
        </div>
      ))}
    </div>
  );
}