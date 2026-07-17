import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchReviews, fetchCategories, getStrapiMedia } from "../api";
import ReviewCard from "../components/ReviewCard";
import { Sparkles, Layers, ArrowUpRight, Flame } from "lucide-react";

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kategorileri 1 kez çekiyoruz
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetchCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Kategoriler alınamadı:", err);
      }
    };
    getCategories();
  }, []);

  // Seçilen kategoriye göre incelemeleri çekiyoruz
  useEffect(() => {
    const getReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchReviews(selectedCategory);
        setReviews(res.data || []);
      } catch (err) {
        setError(
          "İncelemeler yüklenirken bir hata oluştu. Strapi sunucunuz çalışıyor mu?",
        );
      } finally {
        setLoading(false);
      }
    };
    getReviews();
  }, [selectedCategory]);

  // Dizideki ilk incelemeyi (Öne Çıkan / Hero) ayıklıyoruz
  const featuredReview =
    reviews.length > 0 ? reviews[0].attributes || reviews[0] : null;
  const featuredImageUrl = featuredReview
    ? getStrapiMedia(featuredReview.coverImage)
    : null;
  const featuredCategory =
    featuredReview?.category?.data?.attributes?.name ||
    featuredReview?.category?.name ||
    "GENEL";

  return (
    <div className="py-6 animate-fade-in">
      {/* ========================================================= */}
      {/* ADIM 2: DEVASA HERO (ÖNE ÇIKAN İNCELEME) ALANI            */}
      {/* ========================================================= */}

      {loading ? (
        <div className="w-full h-[450px] sm:h-[550px] bg-zinc-900/60 border border-zinc-800/80 rounded-3xl animate-pulse mb-16 flex items-end p-8 sm:p-12">
          <div className="space-y-4 w-full max-w-2xl">
            <div className="h-6 w-32 bg-zinc-800 rounded-md" />
            <div className="h-12 w-3/4 bg-zinc-800 rounded-lg" />
            <div className="h-4 w-full bg-zinc-800/60 rounded" />
          </div>
        </div>
      ) : error ? (
        <div className="p-8 bg-rose-500/10 border border-rose-500/30 rounded-3xl text-center text-rose-400 mb-16 font-gaming">
          <p className="text-lg font-bold">{error}</p>
        </div>
      ) : featuredReview ? (
        <section className="relative w-full h-[480px] sm:h-[580px] rounded-3xl overflow-hidden border border-zinc-800/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] mb-20 group">
          {featuredImageUrl ? (
            <img
              src={featuredImageUrl}
              alt={featuredReview.title}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-zinc-700 font-gaming text-xl">
              Görsel Bulunamadı
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08080a]/90 via-[#08080a]/40 to-transparent" />

          <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10 flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-black tracking-widest uppercase rounded-full font-gaming shadow-lg">
              <Flame className="w-3 h-3 text-indigo-400 fill-indigo-400 animate-pulse" />
              FEATURED REVIEW
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-indigo-600 text-white text-[11px] font-black tracking-widest uppercase rounded font-gaming shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  {featuredCategory}
                </span>
                <span className="text-xs font-bold text-zinc-300 font-gaming tracking-wider">
                  SCORE:{" "}
                  <span className="text-white font-black">
                    {featuredReview.score}
                  </span>
                  /10
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase font-gaming leading-none group-hover:text-indigo-200 transition-colors duration-300">
                {featuredReview.title}
              </h1>

              <p className="mt-3 text-zinc-300 text-sm sm:text-base font-normal line-clamp-2 max-w-2xl leading-relaxed">
                {featuredReview.summary}
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link
                to={`/review/${featuredReview.slug}`}
                className="inline-flex items-center gap-3 bg-white hover:bg-zinc-200 text-black font-gaming font-black px-8 py-4 rounded-xl tracking-widest uppercase text-xs shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>READ MORE</span>
                <ArrowUpRight className="w-4 h-4 text-black font-bold" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ========================================================= */}
      {/* ADIM 3: LATEST REVIEWS & FÜTÜRİSTİK FİLTRE BUTONLARI     */}
      {/* ========================================================= */}
      <section id="latest" className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-zinc-800/80 pb-6">
          {/* Başlık - Vatic.gg Tarzı */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-indigo-600 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-gaming">
              LATEST <span className="text-zinc-500">REVIEWS</span>
            </h2>
          </div>

          {/* Fütüristik Kategori Butonları (Vatic.gg Havası) */}
          <div className="flex flex-wrap items-center gap-2 bg-[#111116] p-1.5 rounded-xl border border-zinc-800/80">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2 rounded-lg text-xs font-gaming font-black tracking-wider uppercase transition-all duration-200 ${
                selectedCategory === "all"
                  ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-[1.02]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
              }`}
            >
              TÜMÜ
            </button>

            {categories.map((cat) => {
              const item = cat.attributes || cat;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(item.slug)}
                  className={`px-5 py-2 rounded-lg text-xs font-gaming font-black tracking-wider uppercase transition-all duration-200 ${
                    selectedCategory === item.slug
                      ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-[1.02]"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Yenilenmiş ReviewCard Grid'i */}
        {!loading && !error && reviews.length === 0 ? (
          <div className="text-center py-20 bg-[#111116] rounded-2xl border border-zinc-800/60 font-gaming">
            <p className="text-zinc-400 font-bold uppercase tracking-wider text-sm">
              BU KATEGORİDE HENÜZ BİR İNCELEME BULUNMUYOR.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {reviews.map((item) => (
              <ReviewCard key={item.id} review={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
