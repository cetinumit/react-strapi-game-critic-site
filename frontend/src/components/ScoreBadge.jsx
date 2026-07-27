import React from "react";

const ScoreBadge = ({ score }) => {
  const numScore = Number(score) || 0;

  // Puana göre dinamik yazı ve çerçeve renkleri
  let badgeColor =
    "text-amber-400 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]"; // Ortalama
  if (numScore >= 8.5) {
    badgeColor =
      "text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]"; // Harika
  } else if (numScore >= 7.0) {
    badgeColor =
      "text-indigo-400 border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]"; // İyi
  }

  return (
    // MİMARİ DÜZELTME: bg-[#08080a]/85 ve backdrop-blur-md ekledik. Arkada beyaz resim olsa bile kusursuz okunur!
    <span
      className={`px-3 py-1 rounded-md text-xs font-black tracking-widest border bg-[#08080a]/85 backdrop-blur-md flex items-center gap-1 font-gaming ${badgeColor}`}
    >
      <span>★</span>
      <span>{numScore}/10</span>
    </span>
  );
};

export default ScoreBadge;
