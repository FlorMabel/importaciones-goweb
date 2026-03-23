import React from 'react';

export default function StarRating({ rating = 0 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <div className="flex items-center gap-0">
      {Array.from({ length: full }, (_, i) => (
        <span key={`f${i}`} className="material-symbols-outlined text-primary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      ))}
      {half === 1 && (
        <span className="material-symbols-outlined text-primary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
      )}
      {Array.from({ length: empty }, (_, i) => (
        <span key={`e${i}`} className="material-symbols-outlined text-gray-300 text-xs">star</span>
      ))}
    </div>
  );
}
