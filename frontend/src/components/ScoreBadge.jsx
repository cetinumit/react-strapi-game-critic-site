import React from "react";

const ScoreBadge = ({ score }) => {
  // Puanı sayıya çevirelim ve formatlayalım
  const numScore = Number(score) || 0;

  // Puana göre dinamik renk belirleme
  let badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20"; // Ortalama
  if (numScore >= 8.5) {
    badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"; // Harika
  } else if (numScore >= 7.0) {
    badgeColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"; // İyi
  }

  return (
    <span
      className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide border ${badgeColor} flex items-center gap-1 shadow-sm`}
    >
      <span>★</span>
      <span>{numScore}/10</span>
    </span>
  );
};

export default ScoreBadge;
