import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  fetchReviewBySlug,
  updateReview,
  isAuthenticated,
  uploadImage,
  fetchCategories,
} from "../api";
import {
  RevisionIcon,
  ReturnIcon,
  SignatureIcon,
  WarningIcon,
  GainIcon,
  LossIcon,
} from "../components/icons";
import TiptapEditor from "../components/TiptapEditor";

// CreateReview ile aynı alan görünümü
const LABEL =
  "block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 font-data";
const FIELD =
  "w-full bg-void border border-line px-4 py-2.5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-phosphor transition-colors";

const EditReview = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [newCover, setNewCover] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const errorRef = useRef(null);

  // Buton en altta, hata bandı en üstte — kaydırmazsak uyarı görülmüyor
  useEffect(() => {
    if (error) {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    score: 0,
    pros: "",
    cons: "",
    content: [],
    category: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
      return;
    }

    const loadData = async () => {
      try {
        const [reviewData, categoriesData] = await Promise.all([
          fetchReviewBySlug(slug),
          fetchCategories(),
        ]);
        const review = reviewData.attributes || reviewData;

        setTargetId(reviewData.documentId || reviewData.id);
        setCategories(categoriesData.data || categoriesData || []);
        setFormData({
          title: review.title || "",
          summary: review.summary || "",
          score: review.score || 0,
          // Ana metni (Blocks JSON dizisini) doğrudan state'e alıyoruz
          content: review.content || [],
          // Dizileri (array) formda alt alta gösterebilmek için birleştiriyoruz
          pros: Array.isArray(review.pros)
            ? review.pros.join("\n")
            : review.pros || "",
          cons: Array.isArray(review.cons)
            ? review.cons.join("\n")
            : review.cons || "",
          category: review.category?.documentId || review.category?.id || "",
        });
      } catch (error) {
        setLoadFailed(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const formattedPros = formData.pros
        .split("\n")
        .filter((item) => item.trim() !== "");
      const formattedCons = formData.cons
        .split("\n")
        .filter((item) => item.trim() !== "");

      const payload = {
        title: formData.title,
        summary: formData.summary,
        score: Number(formData.score),
        pros: formattedPros,
        cons: formattedCons,
        content: formData.content,
        category: formData.category,
      };

      // EĞER YENİ GÖRSEL SEÇİLDİYSE ÖNCE ONU YÜKLE
      if (newCover) {
        const imageId = await uploadImage(newCover);
        payload.coverImage = imageId; // Strapi'deki doğru alan adı: coverImage
      }

      await updateReview(targetId, payload);
      navigate(`/review/${slug}`, { replace: true });
    } catch (err) {
      setError(
        err.message ||
          "Güncellenirken bir hata oluştu. F12 konsolunu kontrol edin.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center">
        <p className="text-[11px] font-data uppercase tracking-widest text-zinc-500 animate-pulse">
          Veriler Yükleniyor...
        </p>
      </div>
    );
  }

  if (loadFailed) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center">
        <span className="inline-flex p-4 bg-critical/10 text-critical border border-critical/20 mb-6">
          <WarningIcon className="w-6 h-6" />
        </span>
        <h1 className="text-xl font-black text-white font-gaming uppercase tracking-tight mb-2">
          İnceleme Yüklenemedi
        </h1>
        <p className="text-zinc-500 text-sm mb-6">
          Kayıt bulunamadı veya sunucuya ulaşılamadı.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-phosphor hover:bg-phosphor-dim text-black text-xs font-black uppercase tracking-widest transition-colors font-gaming"
        >
          <ReturnIcon className="w-4 h-4" /> Ana Sayfa
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      <div className="mb-8 flex items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-[10px] font-data font-bold text-phosphor uppercase tracking-widest flex items-center gap-2 mb-2">
            <RevisionIcon className="w-3.5 h-3.5" /> İçerik Yönetimi
          </span>
          <h1 className="text-3xl font-black text-white font-gaming uppercase tracking-tight">
            İncelemeyi Düzenle
          </h1>
        </div>
        {/* Link kullanmıyoruz: PUSH yapıp düzenleme sayfasını geçmişte bırakıyordu
            ve inceleme sayfasının geri tuşu buraya geri dönüyordu. */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-panel border border-line hover:border-phosphor/40 text-zinc-400 hover:text-white text-[11px] font-data font-bold uppercase tracking-widest transition-colors"
        >
          <ReturnIcon className="w-4 h-4" /> Geri Dön
        </button>
      </div>

      {error && (
        <div
          ref={errorRef}
          role="alert"
          className="mb-6 p-3 bg-critical/10 border border-critical/30 text-critical text-xs flex items-center gap-2.5"
        >
          <WarningIcon className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="relative bg-panel border border-line p-6 sm:p-8 pt-12 space-y-6"
      >
        <div className="absolute top-0 left-0 text-[9px] font-data text-zinc-600 tracking-widest px-3 py-1.5 border-b border-r border-line">
          REVISION-01
        </div>

        {/* Kapak Görseli */}
        <div className="bg-void border border-line p-4">
          <label className={LABEL}>Kapak Görselini Değiştir</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewCover(e.target.files[0])}
            className="w-full text-xs text-zinc-500 font-data file:mr-4 file:py-2 file:px-4 file:border file:border-phosphor/30 file:bg-phosphor/10 file:text-phosphor file:text-[10px] file:font-bold file:uppercase file:tracking-widest hover:file:bg-phosphor hover:file:text-black file:transition-colors cursor-pointer"
          />
          <p className="mt-2 text-[10px] text-zinc-600 font-data uppercase tracking-widest">
            Yeni görsel seçmezseniz eski görsel aynı kalır
          </p>
        </div>

        {/* Kategori ve Puan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={LABEL}>Kategori</label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={`${FIELD} appearance-none pr-10 cursor-pointer`}
              >
                <option value="" disabled>
                  Kategori Seçiniz
                </option>
                {categories.map((cat) => {
                  // Strapi veri yapısına göre cat.attributes.name veya doğrudan cat.name olabilir
                  const catName = cat.name || cat.attributes?.name;
                  const catId = cat.documentId || cat.id;

                  return (
                    <option key={catId} value={catId} className="bg-void">
                      {catName}
                    </option>
                  );
                })}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-zinc-600 font-data">
                ▼
              </span>
            </div>
          </div>

          <div>
            <label className={LABEL}>Puan (10 Üzerinden)</label>
            <input
              type="number"
              step="0.1"
              max="10"
              min="0"
              name="score"
              value={formData.score}
              onChange={handleChange}
              required
              className={`${FIELD} font-data`}
            />
          </div>
        </div>

        {/* Başlık */}
        <div>
          <label className={LABEL}>Başlık</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={FIELD}
          />
        </div>

        {/* Özet */}
        <div>
          <label className={LABEL}>Özet (Summary)</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            rows={3}
            className={`${FIELD} resize-y`}
          />
        </div>

        {/* Ana Metin */}
        <div>
          <label className={`${LABEL} flex items-center gap-2`}>
            <SignatureIcon className="w-3.5 h-3.5 text-phosphor" /> İnceleme
            Metni
          </label>
          <TiptapEditor
            value={formData.content}
            onChange={(newContent) =>
              setFormData({ ...formData, content: newContent })
            }
          />
        </div>

        {/* Artılar ve Eksiler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`${LABEL} text-phosphor flex items-center gap-2`}>
              <GainIcon className="w-3.5 h-3.5" /> Artıları
            </label>
            <textarea
              name="pros"
              value={formData.pros}
              onChange={handleChange}
              rows={5}
              className="w-full bg-void border border-phosphor/25 border-l-2 border-l-phosphor px-4 py-2.5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-phosphor transition-colors resize-y"
            />
            <p className="mt-1.5 text-[10px] text-zinc-600 font-data uppercase tracking-widest">
              Her satıra bir madde
            </p>
          </div>
          <div>
            <label
              className={`${LABEL} text-amber-400 flex items-center gap-2`}
            >
              <LossIcon className="w-3.5 h-3.5" /> Eksileri
            </label>
            <textarea
              name="cons"
              value={formData.cons}
              onChange={handleChange}
              rows={5}
              className="w-full bg-void border border-amber-500/25 border-l-2 border-l-amber-500 px-4 py-2.5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-500 transition-colors resize-y"
            />
            <p className="mt-1.5 text-[10px] text-zinc-600 font-data uppercase tracking-widest">
              Her satıra bir madde
            </p>
          </div>
        </div>

        {/* Kaydet */}
        <div className="pt-2 border-t border-line">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto mt-6 inline-flex justify-center items-center gap-2 bg-phosphor hover:bg-phosphor-dim disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-colors font-gaming"
          >
            <RevisionIcon className={`w-4 h-4 ${saving ? "animate-spin" : ""}`} />
            {saving ? "KAYDEDİLİYOR..." : "DEĞİŞİKLİKLERİ KAYDET"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReview;
