import React, { useEffect, useState } from "react";
import { fetchReviews, fetchCategories } from "../api";
import ReviewCard from "../components/ReviewCard";
import { Sparkles, Layers } from "lucide-react";

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kategorileri sadece sayfa ilk açıldığında 1 kez çekiyoruz
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

  // Seçilen kategori (selectedCategory) her değiştiğinde incelemeleri yeniden filtreleyip çekiyoruz
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

  return (
    <div>
      {/* Hero / Başlık Alanı */}
      <section className="text-center py-12 mb-10 border-b border-slate-900/80">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Yeni Nesil İnceleme Platformu</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          En Son Oyun &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Teknoloji Rehberi
          </span>
        </h1>
        <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Derinlemesine incelemeler, tarafsız puanlamalar ve donanım rehberleri
          ile bir sonraki favori oyununu veya ekipmanını keşfet.
        </p>

        {/* Kategori Filtreleme Butonları */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === "all"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Tümü
          </button>

          {categories.map((cat) => {
            const item = cat.attributes || cat;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(item.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === item.slug
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* İçerik Alanı (Loading / Error / Grid) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-80 bg-slate-900/60 border border-slate-800/80 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-center text-red-400">
          <p className="font-semibold">{error}</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/50">
          <p className="text-slate-400 font-medium">
            Bu kategoride henüz yayınlanmış bir inceleme bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((item) => (
            <ReviewCard key={item.id} review={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
