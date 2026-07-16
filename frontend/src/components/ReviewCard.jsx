import React from "react";
import { Link } from "react-router-dom";
import { getStrapiMedia } from "../api";
import ScoreBadge from "./ScoreBadge";

const ReviewCard = ({ review }) => {
  // Strapi v4/v5 veri tutarlılığı için güvenli erişim
  const data = review.attributes || review;
  const imageUrl = getStrapiMedia(data.coverImage);
  const categoryName =
    data.category?.data?.attributes?.name || data.category?.name || "Genel";

  return (
    <Link
      to={`/review/${data.slug}`}
      className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Görsel Alanı */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-800">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={data.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm">
              Görsel Yok
            </div>
          )}
          {/* Kategori Etiketi (Görsel Üzerinde) */}
          <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-800">
            {categoryName}
          </span>
        </div>

        {/* Metin İçeriği */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors duration-200 line-clamp-1">
            {data.title}
          </h3>
          <p className="text-slate-400 text-sm mt-2 line-clamp-2 leading-relaxed">
            {data.summary}
          </p>
        </div>
      </div>

      {/* Alt Bilgi ve Puan */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-800/60 mt-2">
        <span className="text-xs text-indigo-400 font-medium group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1">
          İncelemeyi Oku →
        </span>
        <ScoreBadge score={data.score} />
      </div>
    </Link>
  );
};

export default ReviewCard;
