import React from "react";

const ScoreBadge = ({ score, size = "sm" }) => {
  const numScore = Number(score) || 0;

  let tone = "text-amber-400 border-amber-500/50";
  if (numScore >= 8.5) tone = "text-phosphor border-phosphor/50";
  else if (numScore >= 7.0) tone = "text-zinc-200 border-zinc-500/50";
  else if (numScore < 5) tone = "text-critical border-critical/50";

  const isLarge = size === "lg";

  return (
    <span
      className={`inline-flex items-stretch bg-void/90 backdrop-blur-md border ${tone} font-data ${
        isLarge ? "text-base" : "text-xs"
      }`}
    >
      <span
        className={`flex items-center px-2 border-r ${tone.split(" ")[1]} text-[9px] tracking-[0.15em] uppercase opacity-70`}
      >
        SKOR
      </span>
      <span className="flex items-center gap-1 px-2.5 font-bold">
        {numScore.toFixed(1)}
        <span className="opacity-50 font-normal">/10</span>
      </span>
    </span>
  );
};

export default ScoreBadge;
