import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, uploadImage, createReview } from "../api";
import {
  AddEntryIcon,
  ReturnIcon,
  AdvanceIcon,
  WarningIcon,
  GainIcon,
  LossIcon,
  LayoutMarkIcon,
  SignatureIcon,
} from "../components/icons";
import { usePageMeta } from "../hooks/usePageMeta";
import TiptapEditor from "../components/TiptapEditor";

// Strapi'nin Blocks alanı dizi bekliyor; içinde gerçekten metin var mı?
const hasText = (blocks) =>
  Array.isArray(blocks) &&
  blocks.some((b) => b.children?.some((c) => (c.text || "").trim()));

// Formda çok tekrar ettikleri için tek yerde tutuyoruz
const LABEL =
  "block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 font-data";
const FIELD =
  "w-full bg-void border border-line px-4 py-2.5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-phosphor transition-colors";

const CreateReview = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const errorRef = useRef(null);

  // Form uzun; hata bandı en üstte, buton en altta. Kaydırmazsak
  // kullanıcı uyarıyı hiç görmüyor ve "hiçbir şey olmadı" sanıyor.
  useEffect(() => {
    if (error) {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  // Form state'leri
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  // EditReview ile aynı format: Strapi Blocks dizisi (düz string değil)
  const [content, setContent] = useState([]);
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

    // Yüklemeye başlamadan önce kontrol et; yoksa "Yayınlanıyor..." bir an yanıp sönüyor
    if (!imageFile) {
      setError("Kapak görseli zorunlu. Lütfen bir görsel seçin.");
      return;
    }

    // Tiptap'ta native "required" yok, kontrolü kendimiz yapıyoruz
    if (!hasText(content)) {
      setError("İnceleme ana gövde metni boş olamaz.");
      return;
    }

    setLoading(true);

    try {
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
        // Dizi olarak gönderiyoruz. JSON.stringify ile string göndermek
        // alanı bozuyordu — EditReview da dizi gönderiyor.
        pros: prosArray,
        cons: consArray,
      };

      // 4. STRAPI'YE İNCELEMEYİ KAYDET
      await createReview(payload);

      // Başarılı olursa yeni oluşturulan detaya yönlendir.
      // replace: oluşturma sayfasını geçmişten çıkarıyor, yoksa detay
      // sayfasındaki geri tuşu buraya geri dönüyordu.
      navigate(`/review/${slug}`, { replace: true });
    } catch (err) {
      setError(
        err.message || "İnceleme oluşturulurken bir hata meydana geldi.",
      );
    } finally {
      setLoading(false);
    }
  };

  usePageMeta({ title: "Yeni İnceleme Ekle", path: "/new-review" });

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      <div className="mb-8 flex items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-[10px] font-data font-bold text-phosphor uppercase tracking-widest flex items-center gap-2 mb-2">
            <AddEntryIcon className="w-3.5 h-3.5" /> İçerik Yönetimi
          </span>
          <h1 className="text-3xl font-black text-white font-gaming uppercase tracking-tight">
            Yeni İnceleme Ekle
          </h1>
        </div>
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
          ENTRY-NEW
        </div>

        {/* Başlık ve Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={LABEL}>İnceleme Başlığı *</label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="Örn: Cyberpunk 2077 - 2.0 Güncellemesi"
              className={FIELD}
            />
          </div>

          <div>
            <label className={LABEL}>URL (Slug) — Otomatik Oluşur *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={`${FIELD} text-phosphor font-data`}
            />
          </div>
        </div>

        {/* Kategori ve Puan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={LABEL}>Kategori *</label>
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={`${FIELD} appearance-none pr-10 cursor-pointer`}
              >
                {categories.map((cat) => {
                  const item = cat.attributes || cat;
                  return (
                    <option key={cat.id} value={cat.id} className="bg-void">
                      {item.name}
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
            <label className={LABEL}>Puan (0 – 10 Arası) *</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              required
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="Örn: 8.5"
              className={`${FIELD} font-data`}
            />
          </div>
        </div>

        {/* Kapak Görseli Yükleme */}
        <div>
          <label className={LABEL}>Kapak Görseli *</label>
          {/* Eksik olan buysa kutuyu da işaretle — uyarı bandı tek başına kalmasın */}
          <div
            className={`border border-dashed bg-void/40 p-8 text-center transition-colors ${
              error && !imageFile
                ? "border-critical/60"
                : "border-line hover:border-phosphor/40"
            }`}
          >
            <input
              type="file"
              id="coverUpload"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="hidden"
              // required YOK: gizli bir alan doğrulamada takılınca tarayıcı
              // uyarı balonunu gösteremiyor ve gönderimi sessizce iptal ediyor.
              // Kontrolü handleSubmit içinde kendimiz yapıyoruz.
            />
            <label
              htmlFor="coverUpload"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <span className="inline-flex p-3 bg-phosphor/10 text-phosphor border border-phosphor/20 mb-4">
                <LayoutMarkIcon className="w-6 h-6" />
              </span>
              {imageFile ? (
                <span className="text-phosphor text-[11px] font-data font-bold uppercase tracking-widest flex items-center gap-2">
                  <GainIcon className="w-4 h-4" /> {imageFile.name}
                </span>
              ) : (
                <span className="text-sm text-zinc-300">
                  Görsel seçmek için tıklayın veya sürükleyin
                </span>
              )}
              <span className="text-[10px] text-zinc-600 mt-2 font-data uppercase tracking-widest">
                PNG · JPG · WEBP — Maks 5MB
              </span>
            </label>
          </div>
        </div>

        {/* Kısa Özet */}
        <div>
          <label className={LABEL}>
            Kısa Özet (Ana Sayfa Kartında Görünür) *
          </label>
          <textarea
            rows="2"
            required
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="İncelemenin can alıcı cümlesini buraya yazın..."
            className={`${FIELD} resize-y`}
          />
        </div>

        {/* Artılar ve Eksiler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              className={`${LABEL} text-phosphor flex items-center gap-2`}
            >
              <GainIcon className="w-3.5 h-3.5" /> Artı Yönleri
            </label>
            <textarea
              rows="4"
              value={prosText}
              onChange={(e) => setProsText(e.target.value)}
              placeholder="Muazzam grafik kalite&#10;Gelişmiş vuruş hissiyatı&#10;Akıcı hikaye"
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
              <LossIcon className="w-3.5 h-3.5" /> Eksi Yönleri
            </label>
            <textarea
              rows="4"
              value={consText}
              onChange={(e) => setConsText(e.target.value)}
              placeholder="Yüksek donanım gereksinimi&#10;Ufak tefek buglar"
              className="w-full bg-void border border-amber-500/25 border-l-2 border-l-amber-500 px-4 py-2.5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-500 transition-colors resize-y"
            />
            <p className="mt-1.5 text-[10px] text-zinc-600 font-data uppercase tracking-widest">
              Her satıra bir madde
            </p>
          </div>
        </div>

        {/* Detaylı Ana Metin */}
        <div>
          <label className={`${LABEL} flex items-center gap-2`}>
            <SignatureIcon className="w-3.5 h-3.5 text-phosphor" /> İnceleme Ana
            Gövde Metni *
          </label>
          <TiptapEditor value={content} onChange={setContent} />
        </div>

        {/* Gönder Butonu */}
        <div className="pt-2 border-t border-line">
          <button
            type="submit"
            disabled={loading}
            className="group w-full mt-6 bg-phosphor hover:bg-phosphor-dim disabled:opacity-50 disabled:cursor-not-allowed text-black font-black py-3.5 px-4 text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 font-gaming"
          >
            <span>
              {loading ? "YAYINLANIYOR..." : "İncelemeyi Yayınla"}
            </span>
            {!loading && (
              <AdvanceIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReview;
