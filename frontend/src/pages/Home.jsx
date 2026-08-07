import React, { useEffect, useState } from "react";
import { Link, useNavigationType } from "react-router-dom";
import { fetchReviews, fetchCategories, getStrapiMedia } from "../api";
import ReviewCard from "../components/ReviewCard";
import { ArrowUpRight, Flame } from "lucide-react";
import About from "../components/About";

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRestored, setIsRestored] = useState(false);
  const navType = useNavigationType();

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

  useEffect(() => {
    if (!loading) {
      if (navType === "POP") {
        const savedPosition = sessionStorage.getItem("homeScrollPosition");
        if (savedPosition !== null) {
          setTimeout(() => {
            window.scrollTo({
              top: parseInt(savedPosition, 10),
              behavior: "instant",
            });
            setIsRestored(true);
          }, 150);
        } else {
          setIsRestored(true);
        }
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
        setIsRestored(true);
      }
    }
  }, [loading, navType]);

  useEffect(() => {
    if (!isRestored) return;
    sessionStorage.setItem("homeScrollPosition", window.scrollY);
    const handleScroll = () => {
      sessionStorage.setItem("homeScrollPosition", window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isRestored]);

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
      {loading ? (
        <div className="w-full h-[450px] sm:h-[550px] bg-panel border border-line rounded-lg animate-pulse mb-16 flex items-end p-8 sm:p-12">
          <div className="space-y-4 w-full max-w-2xl">
            <div className="h-6 w-32 bg-panel-raised" />
            <div className="h-12 w-3/4 bg-panel-raised" />
            <div className="h-4 w-full bg-panel-raised/60" />
          </div>
        </div>
      ) : error ? (
        <div className="p-8 bg-critical/10 border border-critical/30 rounded-lg text-center text-critical mb-16 font-gaming">
          <p className="text-lg font-bold">{error}</p>
        </div>
      ) : featuredReview ? (
        <section className="relative w-full h-[480px] sm:h-[580px] rounded-lg overflow-hidden border border-line shadow-[0_0_50px_rgba(0,0,0,0.8)] mb-20 group">
          {featuredImageUrl ? (
            <img
              src={featuredImageUrl}
              alt={featuredReview.title}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="absolute inset-0 bg-panel-raised flex items-center justify-center text-zinc-700 font-gaming text-xl">
              Görsel Bulunamadı
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-void/60 via-transparent to-transparent" />

          <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10 flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-void/70 backdrop-blur-md border border-phosphor/30 text-phosphor text-[10px] font-bold tracking-widest uppercase font-data shadow-lg">
              <Flame className="w-3 h-3 text-phosphor fill-phosphor/30" />
              ÖNE ÇIKAN İNCELEME
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-phosphor text-black text-[11px] font-black tracking-widest uppercase font-gaming">
                  {featuredCategory}
                </span>
                <span className="text-xs font-bold text-zinc-300 font-data tracking-wider">
                  PUAN:{" "}
                  <span className="text-white font-black">
                    {featuredReview.score}
                  </span>
                  /10
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase font-gaming leading-none group-hover:text-phosphor/90 transition-colors duration-300">
                {featuredReview.title}
              </h1>

              <p className="mt-3 text-zinc-300 text-sm sm:text-base font-normal line-clamp-2 max-w-2xl leading-relaxed">
                {featuredReview.summary}
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link
                to={`/review/${featuredReview.slug}`}
                className="inline-flex items-center gap-3 bg-white hover:bg-phosphor text-black font-gaming font-black px-8 py-4 tracking-widest uppercase text-xs transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>DEVAMINI OKU</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section id="latest" className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-line pb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-phosphor" />
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-gaming">
              SON <span className="text-zinc-500">İNCELEMELER</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-panel p-1.5 border border-line">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2 text-xs font-gaming font-black tracking-wider uppercase transition-all duration-200 ${
                selectedCategory === "all"
                  ? "bg-phosphor text-black"
                  : "text-zinc-400 hover:text-white hover:bg-panel-raised"
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
                  className={`px-5 py-2 text-xs font-gaming font-black tracking-wider uppercase transition-all duration-200 ${
                    selectedCategory === item.slug
                      ? "bg-phosphor text-black"
                      : "text-zinc-400 hover:text-white hover:bg-panel-raised"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>

        {!loading && !error && reviews.length === 0 ? (
          <div className="text-center py-20 bg-panel border border-line font-gaming">
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
      <About />
    </div>
  );
};

export default Home;
