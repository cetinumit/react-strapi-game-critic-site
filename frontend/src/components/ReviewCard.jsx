import React from "react";
import { Link } from "react-router-dom";
import { getStrapiMedia } from "../api";
import ScoreBadge from "./ScoreBadge";
import { AdvanceIcon } from "./icons";

const ReviewCard = ({ review }) => {
  const data = review.attributes || review;
  const imageUrl = getStrapiMedia(data.coverImage);
  const categoryName =
    data.category?.data?.attributes?.name || data.category?.name || "GENEL";

  return (
    <Link
      to={`/review/${data.slug}`}
      className="group relative bg-panel border border-line rounded-lg overflow-hidden hover:border-phosphor/40 hover:shadow-[0_0_30px_rgba(168,232,60,0.08)] transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="relative h-56 w-full overflow-hidden bg-panel-raised">
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

          <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent opacity-80" />

          <span className="absolute top-4 left-4 bg-void/90 backdrop-blur-md text-zinc-300 text-[10px] font-bold tracking-widest px-2.5 py-1 border border-line uppercase font-data">
            {categoryName}
          </span>

          <div className="absolute top-4 right-4 z-10">
            <ScoreBadge score={data.score} />
          </div>

          <div className="absolute bottom-4 right-4 z-10 rotate-[-6deg] border border-zinc-500/40 text-zinc-400/70 text-[8px] font-data tracking-[0.2em] px-2 py-0.5 uppercase opacity-70 group-hover:opacity-100 group-hover:border-phosphor/50 group-hover:text-phosphor transition-all">
            İncelendi
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-black text-white uppercase font-gaming tracking-tight group-hover:text-phosphor transition-colors duration-200 line-clamp-1">
            {data.title}
          </h3>
          <p className="text-zinc-400 text-sm mt-2.5 line-clamp-2 leading-relaxed font-normal">
            {data.summary}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-line mt-2">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors font-gaming">
          İNCELEMEYİ OKU
        </span>
        <div className="w-8 h-8 border border-line flex items-center justify-center group-hover:bg-phosphor group-hover:text-black group-hover:border-phosphor transition-all duration-200">
          <AdvanceIcon className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};

export default ReviewCard;
