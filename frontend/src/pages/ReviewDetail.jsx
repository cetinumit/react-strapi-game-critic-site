import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchReviewBySlug, getStrapiMedia } from "../api";
import ScoreBadge from "../components/ScoreBadge";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Calendar,
  Tag,
  Share2,
} from "lucide-react";

const ReviewDetail = () => {
  // 1. URL'deki ':slug' parametresini yakalıyoruz
  const { slug } = useParams();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Slug değiştiğinde (veya sayfa açıldığında) Strapi'den ilgili incelemeyi çekiyoruz
  useEffect(() => {
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

  // Strapi v5/v4 Rich Text (Blocks) veya düz metin (Text) verisini güvenli render etme fonksiyonu
  const renderContent = (content) => {
    if (!content) return null;

    // Eğer içerik düz metinse (String), paragraflara bölerek şıkça ekrana bas
    if (typeof content === "string") {
      return content.split("\n").map((paragraph, idx) => (
        <p key={idx} className="mb-4 text-slate-300 leading-relaxed">
          {paragraph}
        </p>
      ));
    }

    // Eğer Strapi v5 "Blocks" (Dizi/Array) yapısı kullanılıyorsa:
    if (Array.isArray(content)) {
      return content.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p key={index} className="mb-4 text-slate-300 leading-relaxed">
              {block.children?.map((child, i) => (
                <span
                  key={i}
                  className={
                    child.bold
                      ? "font-bold text-white"
                      : child.italic
                        ? "italic"
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
              className="text-xl font-bold text-white mt-8 mb-3 border-l-4 border-indigo-500 pl-3"
            >
              {block.children?.map((child) => child.text).join(" ")}
            </h3>
          );
        }
        // Diğer blok tipleri için varsayılan metin dökümü
        return (
          <div key={index} className="mb-4 text-slate-300">
            {JSON.stringify(block)}
          </div>
        );
      });
    }

    return null;
  };

  // Yükleniyor durumu (Loading State)
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 animate-pulse">
        <div className="h-6 w-32 bg-slate-800 rounded mb-6" />
        <div className="h-12 w-3/4 bg-slate-800 rounded mb-4" />
        <div className="h-96 w-full bg-slate-800/80 rounded-2xl mb-8" />
        <div className="space-y-3">
          <div className="h-4 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-5/6" />
          <div className="h-4 bg-slate-800 rounded w-4/6" />
        </div>
      </div>
    );
  }

  // Hata durumu (Error State)
  if (error || !review) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center shadow-xl">
        <div className="inline-flex p-3 bg-red-500/10 text-red-400 rounded-full mb-4">
          <XCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Hata!</h2>
        <p className="text-slate-400 text-sm mb-6">{error}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  // Strapi v4/v5 veri tutarlılığı
  const data = review.attributes || review;
  const imageUrl = getStrapiMedia(data.coverImage);
  const categoryName =
    data.category?.data?.attributes?.name || data.category?.name || "Genel";

  // JSON veya Dizi olarak gelen Pros/Cons alanlarını güvenlice ayrıştıralım
  const parseList = (listData) => {
    if (!listData) return [];
    if (Array.isArray(listData)) return listData;
    try {
      return JSON.parse(listData);
    } catch {
      return [listData]; // Geçersiz JSON ise tek elemanlı dizi yap
    }
  };

  const prosList = parseList(data.pros);
  const consList = parseList(data.cons);

  // Tarih formatlama yardımcı fonksiyonu
  const formattedDate = new Date(
    data.publishedAt || data.createdAt,
  ).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Üst Navigasyon / Geri Dön Butonu */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800/80 border border-slate-800 px-3.5 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Tüm İncelemeler
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Başlık ve Kategori */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Tag className="w-3 h-3" />
            {categoryName}
          </span>
          <ScoreBadge score={data.score} />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          {data.title}
        </h1>
        <p className="mt-4 text-lg text-slate-300 font-normal leading-relaxed border-l-2 border-indigo-500/50 pl-4">
          {data.summary}
        </p>
      </header>

      {/* Kapak Görseli */}
      {imageUrl && (
        <div className="relative w-full h-[320px] sm:h-[450px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl mb-12">
          <img
            src={imageUrl}
            alt={data.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Artılar ve Eksiler (Pros & Cons) Izgarası */}
      {(prosList.length > 0 || consList.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Artılar */}
          <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 shadow-lg">
            <h3 className="text-emerald-400 font-bold text-base flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Artı Yönleri (Neyi Beğendik?)
            </h3>
            <ul className="space-y-2.5">
              {prosList.map((pro, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-sm text-slate-300"
                >
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Eksiler */}
          <div className="bg-slate-900/80 border border-rose-500/20 rounded-2xl p-6 shadow-lg">
            <h3 className="text-rose-400 font-bold text-base flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <XCircle className="w-5 h-5 text-rose-500" />
              Eksi Yönleri (Neler Geliştirilmeli?)
            </h3>
            <ul className="space-y-2.5">
              {consList.map((con, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-sm text-slate-300"
                >
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Ana Gövde Metni (Rich Text Content) */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-10 shadow-xl text-base sm:text-lg leading-relaxed">
        {renderContent(data.content)}
      </div>

      {/* Alt Karar (Verdict / Sonuç Paneli) */}
      <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Teknik Kararımız
          </span>
          <h4 className="text-2xl font-black text-white mt-1">
            Genel Değerlendirme Puanı
          </h4>
          <p className="text-sm text-slate-400 mt-1 max-w-md">
            Bu inceleme TechCritic editörleri tarafından tarafsız test
            kriterlerine dayanarak puanlanmıştır.
          </p>
        </div>
        <div className="flex-shrink-0 scale-125">
          <ScoreBadge score={data.score} />
        </div>
      </div>
    </article>
  );
};

export default ReviewDetail;
