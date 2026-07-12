import React from "react";
import { Memory } from "../data/memories";

interface PhotoCardProps {
  memory: Memory;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ memory }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border border-white/20 transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative group">
        <img
          src={memory.imageUrl}
          alt={memory.caption}
          className="w-full h-auto object-cover max-h-96"
          loading="lazy"
        />
        {/* Overlay gradient for text readability if I want text over image, butI'll put text below */}
      </div>

      <div className="p-4 flex flex-col gap-3">
        <p className="text-white/90 text-sm leading-relaxed">
          {memory.caption}
        </p>

        <div className="flex flex-wrap gap-2">
          {memory.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-pink-500/30 text-pink-200 text-xs rounded-full border border-pink-500/30"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mt-2 pt-3 border-t border-white/10 text-xs text-white/50">
          <span>By {memory.contributor}</span>
          <span>
            {new Date(memory.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
