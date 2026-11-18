"use client";
/* eslint-disable @next/next/no-img-element */
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function SwipeCard({ profile, onSwipe }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);

  return (
    <motion.div
      className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-white cursor-grab active:cursor-grabbing select-none"
      style={{ x, rotate, touchAction: "pan-y" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onSwipe("like");
        else if (info.offset.x < -100) onSwipe("pass");
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={(dir) => ({
        x: dir === "like" ? 500 : -500,
        opacity: 0,
        transition: { duration: 0.2 },
      })}
    >
      {/* Profile Image */}
      <img
        src={profile.photo}
        alt={profile.name}
        className="w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
        <h2 className="text-3xl font-bold">
          {profile.name}, <span className="font-normal">{profile.age}</span>
        </h2>
        <p className="text-sm opacity-90 mt-1">📍 {profile.place}</p>
        <p className="text-sm mt-2 line-clamp-2">{profile.bio}</p>
        
        <div className="flex flex-wrap gap-1.5 mt-3">
          {profile.interests?.map((interest) => (
            <span
              key={interest}
              className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}