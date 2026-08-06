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
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Trash2,
  Edit3,
} from "lucide-react";

const ReviewDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isAuth = isAuthenticated();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

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

    if (slug) {
      getReviewData();
    }
  }, [slug]);

  // Gelişmiş Silme Butonu Mantığı (Doğru Yerde!)
  const handleDelete = async (targetId) => {
    const confirmDelete = window.confirm(
      "Bu incelemeyi tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
    );

    if (confirmDelete && targetId) {
      try {
        console.log(`🚀 Silme isteği gönderiliyor. Hedef ID: ${targetId}`);

        await deleteReview(targetId);

        navigate("/");
        window.location.reload();
      } catch (error) {
        const errorMsg =
          error.response?.data?.error?.message ||
          error.message ||
          "Bilinmeyen bir hata";
        const errorStatus = error.response?.status;

        console.error("❌ Strapi Silme İşlemi Başarısız:");
        console.error("Durum Kodu:", errorStatus);
        console.error("Hata Detayı:", error.response?.data?.error || error);

        alert(`Silme işlemi başarısız oldu!\nHata: ${errorMsg}`);
      }
    }
  };

  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="bg-[#08080a] min-h-screen pt-24 px-4">
        <div className="max-w-7xl mx-auto py-12 animate-pulse flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-2/3 space-y-6">
            <div className="h-12 w-3/4 bg-zinc-900 rounded-lg" />
            <div className="h-6 w-1/4 bg-zinc-900 rounded" />
            <div className="h-[400px] w-full bg-zinc-900/80 rounded-3xl" />
          </div>
          <div className="w-full md:w-1/3 space-y-6">
            <div className="h-64 w-full bg-zinc-900 rounded-3xl" />
            <div className="h-48 w-full bg-zinc-900 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // Hata durumu
  if (error || !review) {
    return (
      <div className="bg-[#08080a] min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-[#111116] border border-zinc-800 rounded-3xl text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="inline-flex p-4 bg-rose-500/10 text-rose-500 rounded-full mb-6">
            <XCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3 font-gaming tracking-widest uppercase">
            Hata!
          </h2>
          <p className="text-zinc-400 text-sm mb-8">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all font-gaming"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  // Veri ayıklama ve formatlama
  const data = review.attributes || review;
  const imageUrl = getStrapiMedia(data.coverImage);
  const categoryName =
    data.category?.data?.attributes?.name || data.category?.name || "GENEL";

  // Tarih formatlama
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
              className="text-2xl sm:text-3xl font-black text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-4 font-gaming uppercase tracking-tight"
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
      {/* ========================================================= */}
      {/* TAM EKRAN (FULL-BLEED) SİNEMATİK HERO ALANI - İSTEDİĞİN GÖRÜNÜM */}
      {/* ========================================================= */}
      <div className="relative w-full h-[50vh] sm:h-[65vh] min-h-[450px] bg-zinc-950 border-b border-zinc-800/80 overflow-hidden">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={data.title}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-85 scale-105"
          />
        )}

        {/* Gradientler hafifletildi. Sadece metinlerin okunacağı alt ve sol köşeler koyu kalacak. */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/50 via-transparent to-transparent" />

        {/* Fütüristik Geri Dön Butonu */}
        <div className="absolute top-8 left-4 sm:left-8 md:left-12 z-20">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-zinc-300 hover:text-white hover:bg-white/10 bg-black/50 backdrop-blur-md px-4 py-2.5 rounded-xl border border-zinc-700/50 transition-all font-gaming text-xs font-black tracking-widest uppercase shadow-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            GERİ DÖN
          </button>
        </div>

        {/* Başlık ve Meta Bilgileri */}
        <div className="absolute bottom-0 left-0 w-full z-10 flex flex-col justify-end">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-12">
            <span className="inline-block px-4 py-1.5 bg-indigo-600 text-white text-xs font-black tracking-widest uppercase rounded font-gaming shadow-[0_0_20px_rgba(99,102,241,0.6)] mb-6">
              {categoryName}
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase font-gaming leading-none mb-6 drop-shadow-2xl">
              {data.title}
            </h1>

            {/* Editör, Tarih ve SİL Butonu Paneli */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-gaming bg-zinc-900/80 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold tracking-widest uppercase text-zinc-200">
                    EDİTÖR İNCELEMESİ
                  </span>
                </div>
                <div className="w-1 h-1 bg-zinc-600 rounded-full hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold tracking-widest uppercase text-zinc-200">
                    {formattedDate}
                  </span>
                </div>
              </div>

              {/* Sadece giriş yapmış (isAuth) kullanıcılara SİL butonunu göster */}
              {/* Sadece giriş yapmış kullanıcılara DÜZENLE ve SİL butonlarını göster */}
              {isAuth && targetIdForDelete && (
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to={`/edit/${slug}`}
                    replace={true}
                    className="inline-flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white px-4 py-2.5 rounded-lg border border-indigo-500/50 hover:border-indigo-500 transition-all font-gaming text-xs font-black tracking-widest uppercase shadow-lg"
                  >
                    <Edit3 className="w-4 h-4" />
                    DÜZENLE
                  </Link>

                  <button
                    onClick={() => handleDelete(targetIdForDelete)}
                    className="inline-flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white px-4 py-2.5 rounded-lg border border-rose-500/50 hover:border-rose-500 transition-all font-gaming text-xs font-black tracking-widest uppercase shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    İNCELEMEYİ SİL
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* İÇERİK IZGARASI (GÖVDE + SİDEBAR)                         */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* SOL KOLON */}
          <div className="lg:col-span-8 space-y-10">
            <div className="relative pl-6 py-4 border-l-4 border-indigo-600 bg-gradient-to-r from-indigo-500/10 to-transparent rounded-r-xl">
              <p className="text-xl sm:text-2xl text-white font-medium leading-relaxed font-gaming">
                {data.summary}
              </p>
            </div>

            <div className="rich-text-container">
              {renderContent(data.content)}
            </div>
          </div>

          {/* SAĞ KOLON: Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#111116] border border-zinc-800/80 rounded-3xl p-8 text-center shadow-[0_0_40px_rgba(0,0,0,0.6)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent group-hover:from-indigo-500/10 transition-colors duration-500" />
              <h3 className="text-zinc-400 font-gaming text-sm font-black tracking-widest uppercase mb-6 relative z-10 border-b border-zinc-800 pb-4">
                SONUÇ & PUAN
              </h3>

              <div className="flex items-center justify-center relative z-10 transform scale-150 origin-center my-6">
                <ScoreBadge score={data.score} />
              </div>
            </div>

            {prosList.length > 0 && (
              <div className="bg-[#0b100e] border border-emerald-900/40 rounded-3xl p-6 sm:p-8 shadow-lg">
                <h3 className="text-emerald-400 font-gaming text-sm font-black tracking-widest uppercase mb-6 flex items-center gap-3 border-b border-emerald-900/30 pb-4">
                  <CheckCircle2 className="w-5 h-5 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  ARTILARI
                </h3>
                <ul className="space-y-4">
                  {prosList.map((pro, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-zinc-300 text-sm font-medium leading-relaxed"
                    >
                      <span className="text-emerald-500 font-black text-lg mt-[-2px]">
                        +
                      </span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {consList.length > 0 && (
              <div className="bg-[#120a0a] border border-rose-900/40 rounded-3xl p-6 sm:p-8 shadow-lg">
                <h3 className="text-rose-400 font-gaming text-sm font-black tracking-widest uppercase mb-6 flex items-center gap-3 border-b border-rose-900/30 pb-4">
                  <XCircle className="w-5 h-5 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                  EKSİLERİ
                </h3>
                <ul className="space-y-4">
                  {consList.map((con, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-zinc-300 text-sm font-medium leading-relaxed"
                    >
                      <span className="text-rose-500 font-black text-lg mt-[-2px]">
                        -
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
