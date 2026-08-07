import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchReviewBySlug,
  getStrapiMedia,
  isAuthenticated,
  deleteReview,
} from "../api";
import ScoreBadge from "../components/ScoreBadge";
import {
  ReturnIcon,
  SignatureIcon,
  TimestampIcon,
  RevisionIcon,
  RejectStampIcon,
  GainIcon,
  LossIcon,
  FaultIcon,
} from "../components/icons";

const ReviewDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isAuth = isAuthenticated();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const getReviewData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchReviewBySlug(slug);
        if (!data) {
          setError("Aradığınız inceleme bulunamadı veya yayından kaldırılmış.");
        } else {
          setReview(data);
        }
      } catch (err) {
        setError("İnceleme detayları yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    if (slug) getReviewData();
  }, [slug]);

  const handleDelete = async (targetId) => {
    const confirmDelete = window.confirm(
      "Bu incelemeyi tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
    );
    if (confirmDelete && targetId) {
      try {
        await deleteReview(targetId);
        navigate("/");
        window.location.reload();
      } catch (error) {
        const errorMsg =
          error.response?.data?.error?.message ||
          error.message ||
          "Bilinmeyen bir hata";
        alert(`Silme işlemi başarısız oldu!\nHata: ${errorMsg}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-void min-h-screen pt-24 px-4">
        <div className="max-w-7xl mx-auto py-12 animate-pulse flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-2/3 space-y-6">
            <div className="h-12 w-3/4 bg-panel" />
            <div className="h-6 w-1/4 bg-panel" />
            <div className="h-[400px] w-full bg-panel" />
          </div>
          <div className="w-full md:w-1/3 space-y-6">
            <div className="h-64 w-full bg-panel" />
            <div className="h-48 w-full bg-panel" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="bg-void min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-panel border border-line text-center">
          <div className="inline-flex p-4 bg-critical/10 text-critical mb-6">
            <FaultIcon className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3 font-gaming tracking-widest uppercase">
            Hata!
          </h2>
          <p className="text-zinc-400 text-sm mb-8">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-phosphor text-black text-xs font-black uppercase tracking-widest transition-all font-gaming"
          >
            <ReturnIcon className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const data = review.attributes || review;
  const imageUrl = getStrapiMedia(data.coverImage);
  const categoryName =
    data.category?.data?.attributes?.name || data.category?.name || "GENEL";

  const formattedDate = new Date(
    data.publishedAt || data.createdAt,
  ).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const parseList = (listData) => {
    if (!listData) return [];
    if (Array.isArray(listData)) return listData;
    try {
      return JSON.parse(listData);
    } catch {
      return listData.split("\n").filter((item) => item.trim() !== "");
    }
  };

  const prosList = parseList(data.pros);
  const consList = parseList(data.cons);

  const renderContent = (content) => {
    if (!content) return null;
    if (typeof content === "string") {
      return content.split("\n").map((paragraph, idx) => (
        <p
          key={idx}
          className="mb-6 text-zinc-300 leading-relaxed font-light text-lg"
        >
          {paragraph}
        </p>
      ));
    }
    if (Array.isArray(content)) {
      return content.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p
              key={index}
              className="mb-6 text-zinc-300 leading-relaxed font-light text-lg"
            >
              {block.children?.map((child, i) => (
                <span
                  key={i}
                  className={
                    child.bold
                      ? "font-black text-white font-gaming tracking-wide"
                      : child.italic
                        ? "italic text-zinc-400"
                        : ""
                  }
                >
                  {child.text}
                </span>
              ))}
            </p>
          );
        }
        if (block.type === "heading") {
          return (
            <h3
              key={index}
              className="text-2xl sm:text-3xl font-black text-white mt-12 mb-6 border-l-4 border-phosphor pl-4 font-gaming uppercase tracking-tight"
            >
              {block.children?.map((child) => child.text).join(" ")}
            </h3>
          );
        }
        return (
          <div key={index} className="mb-4 text-zinc-500 text-sm">
            {JSON.stringify(block)}
          </div>
        );
      });
    }
    return null;
  };

  const targetIdForDelete =
    review?.documentId || review?.id || data?.documentId || data?.id;

  return (
    <article className="pb-24 animate-fade-in min-h-screen">
      <div className="relative w-full h-[50vh] sm:h-[65vh] min-h-[450px] bg-void border-b border-line overflow-hidden">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={data.title}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-85 scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/50 via-transparent to-transparent" />

        <div className="absolute top-8 left-4 sm:left-8 md:left-12 z-20">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-zinc-300 hover:text-black hover:bg-phosphor bg-void/60 backdrop-blur-md px-4 py-2.5 border border-line hover:border-phosphor transition-all font-gaming text-xs font-black tracking-widest uppercase cursor-pointer"
          >
            <ReturnIcon className="w-4 h-4" />
            GERİ DÖN
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full z-10 flex flex-col justify-end">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-12">
            <span className="inline-block px-4 py-1.5 bg-phosphor text-black text-xs font-black tracking-widest uppercase font-gaming mb-6">
              {categoryName}
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase font-gaming leading-none mb-6 drop-shadow-2xl">
              {data.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-data bg-panel/80 backdrop-blur-sm px-4 py-2.5 border border-line">
                <div className="flex items-center gap-2">
                  <SignatureIcon className="w-4 h-4 text-phosphor" />
                  <span className="font-bold tracking-widest uppercase text-zinc-200">
                    EDİTÖR İNCELEMESİ
                  </span>
                </div>
                <div className="w-1 h-1 bg-zinc-600 rounded-full hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <TimestampIcon className="w-4 h-4 text-phosphor" />
                  <span className="font-bold tracking-widest uppercase text-zinc-200">
                    {formattedDate}
                  </span>
                </div>
              </div>

              {isAuth && targetIdForDelete && (
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to={`/edit/${slug}`}
                    replace={true}
                    className="inline-flex items-center gap-2 bg-phosphor/10 hover:bg-phosphor text-phosphor hover:text-black px-4 py-2.5 border border-phosphor/50 hover:border-phosphor transition-all font-gaming text-xs font-black tracking-widest uppercase"
                  >
                    <RevisionIcon className="w-4 h-4" />
                    DÜZENLE
                  </Link>

                  <button
                    onClick={() => handleDelete(targetIdForDelete)}
                    className="inline-flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black px-4 py-2.5 border border-amber-500/50 hover:border-amber-500 transition-all font-gaming text-xs font-black tracking-widest uppercase"
                  >
                    <RejectStampIcon className="w-4 h-4" />
                    İNCELEMEYİ SİL
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-10">
            <div className="relative pl-6 py-4 border-l-4 border-phosphor bg-gradient-to-r from-phosphor/5 to-transparent">
              <p className="text-xl sm:text-2xl text-white font-medium leading-relaxed font-gaming">
                {data.summary}
              </p>
            </div>
            <div className="rich-text-container">
              {renderContent(data.content)}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-panel border border-line p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 text-[9px] font-data text-zinc-600 tracking-widest px-2 py-1 border-b border-r border-line">
                CAL-REPORT
              </div>
              <h3 className="text-zinc-400 font-gaming text-sm font-black tracking-widest uppercase mb-6 pt-4 border-b border-line pb-4">
                SONUÇ & PUAN
              </h3>
              <div className="flex items-center justify-center relative z-10 transform scale-150 origin-center my-6">
                <ScoreBadge score={data.score} size="lg" />
              </div>
            </div>

            {prosList.length > 0 && (
              <div className="bg-panel border-l-2 border-phosphor p-6 sm:p-8">
                <h3 className="text-phosphor font-gaming text-sm font-black tracking-widest uppercase mb-6 flex items-center gap-3 border-b border-line pb-4">
                  <GainIcon className="w-5 h-5" />
                  ARTILARI
                </h3>
                <ul className="space-y-4">
                  {prosList.map((pro, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-zinc-300 text-sm font-medium leading-relaxed"
                    >
                      <span className="text-phosphor font-black text-lg mt-[-2px]">
                        +
                      </span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {consList.length > 0 && (
              <div className="bg-panel border-l-2 border-amber-500 p-6 sm:p-8">
                <h3 className="text-amber-400 font-gaming text-sm font-black tracking-widest uppercase mb-6 flex items-center gap-3 border-b border-line pb-4">
                  <LossIcon className="w-5 h-5" />
                  EKSİLERİ
                </h3>
                <ul className="space-y-4">
                  {consList.map((con, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-zinc-300 text-sm font-medium leading-relaxed"
                    >
                      <span className="text-amber-500 font-black text-lg mt-[-2px]">
                        –
                      </span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ReviewDetail;
