import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, uploadImage, createReview } from "../api";
import {
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

const CreateReview = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state'leri
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [score, setScore] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Artı ve Eksileri satır satır alıp diziye çevirmek için text state'leri
  const [prosText, setProsText] = useState("");
  const [consText, setConsText] = useState("");

  // Sayfa yüklendiğinde kategorileri çek (select box için)
  useEffect(() => {
    const getCats = async () => {
      try {
        const res = await fetchCategories();
        const catList = res.data || [];
        setCategories(catList);
        // Varsayılan olarak ilk kategoriyi seç
        if (catList.length > 0) {
          setCategoryId(catList[0].id);
        }
      } catch (err) {
        console.error("Kategoriler alınamadı:", err);
      }
    };
    getCats();
  }, []);

  // Başlık yazıldıkça URL dostu Slug oluşturma yardımcı fonksiyonu
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);

    // Türkçe karakterleri çevir ve boşlukları tire (-) yap
    const generatedSlug = val
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9\s-]/g, "") // Özel karakterleri sil
      .trim()
      .replace(/\s+/g, "-");

    setSlug(generatedSlug);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!imageFile) {
        throw new Error("Lütfen inceleme için bir kapak görseli yükleyin.");
      }

      // 1. ÖNCE RESMİ STRAPI'YE YÜKLE VE ID'SİNİ AL
      const uploadedImageId = await uploadImage(imageFile);

      // 2. METİN ASILINDA Kİ ARTI VE EKSİLERİ DİZİYE (ARRAY) ÇEVİR
      // Örn: "Harika grafikler\nAkıcı oyun" -> ["Harika grafikler", "Akıcı oyun"]
      const prosArray = prosText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
      const consArray = consText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      // 3. STRAPI GÖNDERİM PAKETİNİ (PAYLOAD) HAZIRLA
      const payload = {
        title,
        slug,
        summary,
        content,
        score: Number(score),
        category: categoryId,
        coverImage: uploadedImageId,
        pros: JSON.stringify(prosArray), // Strapi'deki JSON alanına uygun format
        cons: JSON.stringify(consArray),
      };

      // 4. STRAPI'YE İNCELEMEYİ KAYDET
      await createReview(payload);

      // Başarılı olursa yeni oluşturulan detaya yönlendir
      navigate(`/review/${slug}`);
    } catch (err) {
      setError(
        err.message || "İnceleme oluşturulurken bir hata meydana geldi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      <div className="mb-8 flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> İçerik Yönetimi
          </span>
          <h1 className="text-3xl font-black text-white">Yeni İnceleme Ekle</h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Geri Dön
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 rounded-2xl shadow-xl"
      >
        {/* Başlık ve Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              İnceleme Başlığı *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="Örn: Cyberpunk 2077 - 2.0 Güncellemesi"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              URL (Slug) - Otomatik Oluşur *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Kategori ve Puan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Kategori *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {categories.map((cat) => {
                const item = cat.attributes || cat;
                return (
                  <option key={cat.id} value={cat.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Puan (0 - 10 Arası) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              required
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="Örn: 8.5"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Kapak Görseli Yükleme */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Kapak Görseli *
          </label>
          <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-6 text-center transition-all bg-slate-950/40">
            <input
              type="file"
              id="coverUpload"
              accept="image/*"
              required
              onChange={(e) => setImageFile(e.target.files[0])}
              className="hidden"
            />
            <label
              htmlFor="coverUpload"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <Upload className="w-8 h-8 text-indigo-400 mb-2 animate-bounce" />
              <span className="text-sm font-medium text-slate-300">
                {imageFile ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Seçildi:{" "}
                    {imageFile.name}
                  </span>
                ) : (
                  "Resim seçmek için tıklayın veya sürükleyin"
                )}
              </span>
              <span className="text-xs text-slate-500 mt-1">
                PNG, JPG, WEBP (Max: 5MB)
              </span>
            </label>
          </div>
        </div>

        {/* Kısa Özet */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Kısa Özet (Ana Sayfa Kartında Görünür) *
          </label>
          <textarea
            rows="2"
            required
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="İncelemenin can alıcı cümlesini buraya yazın..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Artılar ve Eksiler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
              Artı Yönleri (Her satıra bir madde)
            </label>
            <textarea
              rows="3"
              value={prosText}
              onChange={(e) => setProsText(e.target.value)}
              placeholder="Muazzam grafik kalite&#10;Gelişmiş vuruş hissiyatı&#10;Akıcı hikaye"
              className="w-full bg-slate-950 border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2">
              Eksi Yönleri (Her satıra bir madde)
            </label>
            <textarea
              rows="3"
              value={consText}
              onChange={(e) => setConsText(e.target.value)}
              placeholder="Yüksek donanım gereksinimi&#10;Ufak tefek buglar"
              className="w-full bg-slate-950 border border-rose-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Detaylı Ana Metin */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            İnceleme Ana Gövde Metni (Detaylar) *
          </label>
          <textarea
            rows="6"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Oyun veya donanım hakkında tüm detayları paragraf paragraf anlatın..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {/* Gönder Butonu */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="animate-pulse">
              Strapi'ye Yükleniyor... Lütfen Bekleyin...
            </span>
          ) : (
            <span>İncelemeyi Yayınla</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateReview;
