import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  fetchReviewBySlug,
  updateReview,
  isAuthenticated,
  uploadImage,
} from "../api";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const EditReview = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [newCover, setNewCover] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    score: 0,
    pros: "",
    cons: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
      return;
    }

    const loadData = async () => {
      try {
        const data = await fetchReviewBySlug(slug);
        const review = data.attributes || data;

        setTargetId(data.documentId || data.id);

        setFormData({
          title: review.title || "",
          summary: review.summary || "",
          score: review.score || 0,
          // Dizileri (array) formda alt alta gösterebilmek için birleştiriyoruz
          pros: Array.isArray(review.pros)
            ? review.pros.join("\n")
            : review.pros || "",
          cons: Array.isArray(review.cons)
            ? review.cons.join("\n")
            : review.cons || "",
        });
      } catch (error) {
        alert("Veriler yüklenirken hata oluştu.");
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
      };

      // EĞER YENİ GÖRSEL SEÇİLDİYSE ÖNCE ONU YÜKLE
      if (newCover) {
        const imageId = await uploadImage(newCover);
        payload.cover = imageId; // Yeni görselin ID'sini payload'a ekle
      }

      await updateReview(targetId, payload);
      navigate(`/review/${slug}`);
    } catch (error) {
      alert("Güncellenirken bir hata oluştu. F12 Konsolunu kontrol edin.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400 bg-zinc-950">
        Veriler Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to={`/review/${slug}`}
            className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-black text-white font-gaming uppercase tracking-widest">
            İncelemeyi Düzenle
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#111116] border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl"
        >
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2">
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-widest">
              Kapak Görselini Değiştir
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewCover(e.target.files[0])}
              className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500 hover:file:text-white transition-all cursor-pointer"
            />
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
              Yeni bir görsel seçmezseniz eski görsel aynı kalır.
            </p>
          </div>
          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">
              Başlık
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">
              Özet (Summary)
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              rows={3}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">
              Puan (10 Üzerinden)
            </label>
            <input
              type="number"
              step="0.1"
              max="10"
              min="0"
              name="score"
              value={formData.score}
              onChange={handleChange}
              required
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
                Artıları (Her satıra bir tane)
              </label>
              <textarea
                name="pros"
                value={formData.pros}
                onChange={handleChange}
                rows={5}
                className="w-full bg-zinc-900/50 border border-emerald-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label className="block text-rose-400 text-xs font-bold uppercase tracking-widest mb-2">
                Eksileri (Her satıra bir tane)
              </label>
              <textarea
                name="cons"
                value={formData.cons}
                onChange={handleChange}
                rows={5}
                className="w-full bg-zinc-900/50 border border-rose-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-4 rounded-xl transition-all font-gaming font-black tracking-widest uppercase shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {saving ? "KAYDEDİLİYOR..." : "DEĞİŞİKLİKLERİ KAYDET"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReview;
