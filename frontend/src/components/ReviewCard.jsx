import React from "react";
import { Link } from "react-router-dom";
import { getStrapiMedia } from "../api";
import ScoreBadge from "./ScoreBadge";
import { ArrowUpRight } from "lucide-react";

const ReviewCard = ({ review }) => {
  // Strapi v4/v5 veri tutarlılığı için güvenli erişim
  const data = review.attributes || review;
  const imageUrl = getStrapiMedia(data.coverImage);
  const categoryName =
    data.category?.data?.attributes?.name || data.category?.name || "GENEL";

  return (
    <Link
      to={`/review/${data.slug}`}
      className="group relative bg-[#111116] border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-600 hover:shadow-[0_0_30px_rgba(0,0,0,0.9)] transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5"
    >
      <div>
        {/* Görsel Alanı ve Hover Animasyonu */}
        <div className="relative h-56 w-full overflow-hidden bg-zinc-900">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={data.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600 font-gaming text-xs uppercase">
              Görsel Yok
            </div>
          )}

          {/* Görsel Üzerindeki Karanlık Gradient (Metin okunabilirligi & atmosfer icin) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-transparent opacity-80" />

          {/* Kategori Etiketi (Sol Üst) - Keskin E-Spor Tarzı */}
          <span className="absolute top-4 left-4 bg-[#08080a]/90 backdrop-blur-md text-white text-[10px] font-black tracking-widest px-3 py-1 rounded border border-zinc-800 uppercase font-gaming shadow-md group-hover:border-indigo-500/50 transition-colors">
            {categoryName}
          </span>

          {/* Puan Rozeti (Sağ Üst) */}
          <div className="absolute top-4 right-4 z-10">
            <ScoreBadge score={data.score} />
          </div>
        </div>

        {/* Metin İçeriği */}
        <div className="p-6">
          <h3 className="text-xl font-black text-white uppercase font-gaming tracking-tight group-hover:text-indigo-400 transition-colors duration-200 line-clamp-1">
            {data.title}
          </h3>
          <p className="text-zinc-400 text-sm mt-2.5 line-clamp-2 leading-relaxed font-normal">
            {data.summary}
          </p>
        </div>
      </div>

      {/* Alt Bilgi - Fütüristik "READ REVIEW" Çizgisi */}
      <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-zinc-800/60 mt-2">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors flex items-center gap-1 font-gaming">
          READ REVIEW
        </span>
        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-200">
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:scale-110" />
        </div>
      </div>
    </Link>
  );
};

export default ReviewCard;
