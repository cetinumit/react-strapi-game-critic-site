const axios = require("axios");

const STRAPI_URL = "http://localhost:1337/api/reviews";

// Düz metinleri Strapi v5 "Blocks" (Zengin Metin) formatına çeviren yardımcı fonksiyon
const formatToStrapiBlocks = (text) => {
  return text.split("\n\n").map((paragraph) => ({
    type: "paragraph",
    children: [{ type: "text", text: paragraph.trim() }],
  }));
};

const mockReviews = [
  // ================= 🎮 OYUN İNCELEMELERİ (9 ADET) =================
  {
    title: "Cyberpunk 2077: Phantom Liberty",
    slug: "cyberpunk-2077-phantom-liberty",
    summary:
      "Night City'nin karanlık sokaklarında geçen kusursuz bir casusluk gerilimi.",
    content:
      "RPG elementlerinin derinleştiği, yetenek ağaçlarının tamamen baştan yazıldığı bir eklenti paketi. Yeni eklenen Dogtown bölgesi, ana oyundan çok daha yoğun ve detaylı bir atmosfere sahip.\n\nAksiyon dozu ve hikaye anlatımı arasındaki denge mükemmel kurulmuş. Özellikle karakter diyaloglarındaki sinematik akış, endüstri standartlarını yeniden belirliyor.",
    score: 9.4,
    pros: [
      "Harika hikaye anlatımı",
      "Yenilenmiş yetenek ağacı",
      "Göz alıcı grafikler",
    ],
    cons: [
      "Sistem gereksinimleri çok yüksek",
      "Araç sürüş dinamikleri hala zayıf",
    ],
  },
  {
    title: "Elden Ring: Shadow of the Erdtree",
    slug: "elden-ring-shadow-of-the-erdtree",
    summary:
      "FromSoftware, açık dünya formülünü bu devasa genişleme paketiyle arşa çıkarıyor.",
    content:
      "Yeni keşfedilebilir alanlar, dikey tasarım anlamında ana oyundan bile daha cesur. Düşman yapay zekası ve boss savaşlarındaki ritim, oyuncuyu sürekli tetikte tutuyor.\n\nSadece yeni silahlar ve büyüler eklemekle kalmayan yapım, serinin alt metnini de tamamen aydınlatan kritik bir hikaye sunuyor. Karanlık fantezi sevenler için bir başyapıt.",
    score: 9.8,
    pros: [
      "İnanılmaz bölüm tasarımı",
      "Çok derin zindanlar",
      "Yeni silah çeşitliliği",
    ],
    cons: ["Zorluk eğrisi acımasız", "Kamera bazen dar alanlarda sapıtıyor"],
  },
  {
    title: "EA Sports FC 26",
    slug: "ea-sports-fc-26",
    summary: "Yeşil sahalarda animasyon ve fizik devrimi yapan bir simülasyon.",
    content:
      "Futbol simülasyonları arasında liderliğini koruyan yapım, bu yıl özellikle top fizikleri ve oyuncu tepkilerinde ciddi bir sıçrama yapmış. Taktiksel kurguyu oluştururken oyuncuların saha içi dizilimleri eskiye nazaran çok daha akıcı.\n\nÖzellikle kanat organizasyonlarında ve oyuncuların alan daraltma taktiklerinde gözle görülür bir yapay zeka geliştirmesi mevcut.",
    score: 8.2,
    pros: [
      "Gelişmiş top fiziği",
      "Akıcı oyuncu animasyonları",
      "Taktiksel zenginlik",
    ],
    cons: [
      "Kariyer modunda yenilik az",
      "Ultimate Team mikro ödemeleri agresif",
    ],
  },
  {
    title: "No Man's Sky: Yıldızların Ötesinde",
    slug: "no-mans-sky",
    summary:
      "Sürekli güncellemelerle evrim geçiren yapım, devasa bir evren sunuyor.",
    content:
      "Büyük güncellemeler ve optimizasyon yamalarıyla birlikte uzay keşfi hiç bu kadar tatmin edici olmamıştı. Geminize atlayıp galaksiler arası seyahat ederken her gezegenin kendine has florasıyla karşılaşmak muazzam.\n\nOyun kodlarında ve modlama yapısında yapılan son değişiklikler, performansı ciddi anlamda artırmış. Artık kendi üssünüzü kurmak ve ticaret ağları yönetmek çok daha stabil.",
    score: 8.8,
    pros: [
      "Sınırsız keşif hissi",
      "Muazzam topluluk desteği",
      "Devasa ücretsiz güncellemeler",
    ],
    cons: ["Başlangıçta öğrenme eğrisi dik", "Yakın dövüş hissi hala odunsu"],
  },
  {
    title: "League of Legends: 2026 Sezonu",
    slug: "league-of-legends-2026",
    summary:
      "MOBA türünün tartışmasız lideri, e-spor sahnesini domine etmeye devam ediyor.",
    content:
      "Sürekli güncellenen şampiyon havuzu, eşya sistemi değişiklikleri ve devasa e-spor ekosistemiyle oyun hala ilk günkü rekabetçi ruhunu koruyor. Makro oyun bilgisinin ve anlık reflekslerin çok iyi harmanlandığı bir yapı.\n\nOptimizasyon araçları sayesinde düşük donanımlı sistemlerde bile yüksek kare hızlarıyla stabil bir şekilde çalışmaya devam etmesi en büyük avantajı.",
    score: 9.0,
    pros: [
      "İnanılmaz taktiksel derinlik",
      "Sürekli güncel metalar",
      "Kusursuz optimizasyon",
    ],
    cons: [
      "Zehirli (toxic) oyuncu kitlesi",
      "Yeni başlayanlar için cezalandırıcı",
    ],
  },
  {
    title: "Pathfinder's Lab: A* Algoritmasının Gücü",
    slug: "pathfinders-lab",
    summary:
      "Bulmaca türünü yazılım mantığıyla birleştiren zeka dolu bir indie yapım.",
    content:
      "Bölümleri geçerken sadece deneme yanılma yapmak yetmiyor. Oyunun temel mekaniği, engelleri aşarken en kısa yolu bulmanızı sağlayan A* (A-Yıldız) algoritması mantığı üzerine kurulmuş.\n\nSadece bir oyun değil, zihni inanılmaz derecede zinde tutan, algoritmik düşünme ve problem çözme yeteneğinizi adım adım sınayan çok özel bir tecrübe.",
    score: 8.5,
    pros: [
      "A* algoritması ile çalışan zeki bulmacalar",
      "Minimalist ve şık sanat tasarımı",
    ],
    cons: ["Bölüm sayısı biraz yetersiz", "Müzikler tekrara düşüyor"],
  },
  {
    title: "Galactic Drifter",
    slug: "galactic-drifter",
    summary:
      "Eski usul RPG elementlerini uzay boşluğuyla harmanlayan özgürlükçü bir serüven.",
    content:
      "Dijital sahiplik konusunun tartışıldığı bu dönemde, oyunun tamamen DRM-free (kopya korumasız) olarak sunulması büyük bir artı. Çevrimdışı oynanabilirlik ve geniş mod desteği sunuyor.\n\nGeminizin sistemlerini mikro-yönetimle kontrol ettiğiniz, karakter gelişiminin tamamen sizin seçimlerinize bırakıldığı safkan bir rol yapma deneyimi.",
    score: 8.3,
    pros: [
      "DRM-free olarak sunulması",
      "Derin evren tasarımı ve rol yapma özgürlüğü",
    ],
    cons: ["Arayüz tasarımı ve menüler hantal", "Yan görevler yavan kalmış"],
  },
  {
    title: "Valorant: Yeni Ajanlar, Yeni Meta",
    slug: "valorant-2026",
    summary:
      "Hassas nişan alma mekaniklerini yeteneklerle birleştiren taktiksel nişancı oyunu.",
    content:
      "Anti-hile sistemi Vanguard'ın güncellemeleriyle birlikte rekabetçi deneyim çok daha adil bir seviyeye ulaşmış. Yeni eklenen ajanların meta üzerindeki etkileri, maçların seyrini tamamen değiştiriyor.\n\nSilahların tepme mekanikleri ve sprey kontrolleri, CS kültüründen gelen oyuncuları bile tatmin edecek kadar tok ve tutarlı bir hisse sahip.",
    score: 8.7,
    pros: ["Keskin ve tok vuruş hissi", "Kusursuz çalışan anti-hile sistemi"],
    cons: [
      "Kozmetik ürünler çok pahalı",
      "Harita rotasyonu bazen sıkıcı olabiliyor",
    ],
  },
  {
    title: "Hades II: Yeraltı Dünyasına Dönüş",
    slug: "hades-2",
    summary:
      "Roguelike türünün zirve noktasını temsil eden kusursuz bir aksiyon şöleni.",
    content:
      "Supergiant Games, ilk oyunun mükemmel formülünü alıp hem dövüş mekanikleri hem de hikaye anlatımı açısından çok daha ileriye taşımış. Yeni ana karakterimizin büyü ve yakın dövüşü birleştiren komboları çok akıcı.\n\nHer ölümden sonra üsse döndüğünüzde karşılaştığınız diyaloglar o kadar iyi yazılmış ki, bazen sırf hikayeyi ilerletmek için bilerek ölmek istiyorsunuz.",
    score: 9.6,
    pros: [
      "Kusursuz ve akıcı dövüş sistemi",
      "İnanılmaz seslendirme ve müzikler",
    ],
    cons: ["Ekran bazen efektlerden kör edici olabiliyor"],
  },

  // ================= 💻 DONANIM İNCELEMELERİ (9 ADET) =================
  {
    title: "NVIDIA GeForce RTX 5080",
    slug: "nvidia-rtx-5080",
    summary:
      "4K çözünürlükte oyuncular için yeni dönemin kapılarını aralayan grafik canavarı.",
    content:
      "DLSS 4 teknolojisiyle birlikte donanımsal ışın izleme (ray tracing) performansı inanılmaz boyutlara ulaşmış. 4K Ultra ayarlarda bile Cyberpunk 2077'de akıcı kare hızları sunabiliyor.\n\nSoğutma bloğu bir önceki nesle göre daha optimize edilmiş olsa da, kasanızda ciddi bir yer açmanız ve iyi bir güç kaynağına sahip olmanız şart.",
    score: 9.5,
    pros: [
      "4K oyunculukta rakipsiz performans",
      "Yapay zeka destekli DLSS 4.0 sıçraması",
    ],
    cons: ["Fiyat etiketi çok yüksek", "Devasa fiziksel boyut"],
  },
  {
    title: "AMD Ryzen 7 9800X3D",
    slug: "amd-ryzen-7-9800x3d",
    summary: "Oyun performansı arayanlar için piyasadaki en mantıklı işlemci.",
    content:
      "Özellikle e-spor oyunlarında ve devasa açık dünyalarda, 3D V-Cache teknolojisi sayesinde anlık FPS düşüşlerini (1% low) tamamen ortadan kaldırıyor. Valorant veya CS2 oynarken kare hızlarındaki stabilite muazzam.\n\nIsı değerleri önceki nesle göre çok daha kontrol altında. İyi bir hava soğutucu ile bile tam yükte frekans düşürmeden çalışabiliyor.",
    score: 9.2,
    pros: [
      "Oyun performansında tartışmasız lider",
      "İnanılmaz stabil 1% low FPS değerleri",
    ],
    cons: ["Render ve iş yüklerinde rakiplerinin gerisinde"],
  },
  {
    title: "DevView 34-inç Ultrawide Monitör",
    slug: "devview-34-ultrawide",
    summary:
      "Aynı anda birden fazla çalışma alanını yöneten geliştiriciler ve oyuncular için.",
    content:
      "Ekranı ikiye bölüp bir tarafta Tailwind CSS v4 ile arayüz bileşenleri tasarlarken, diğer tarafta yerel test sunucularını veya oyun motorunu yan yana sorunsuz takip etmek için inanılmaz bir genişlik sunuyor.\n\n144Hz yenileme hızı ve düşük tepki süresi sayesinde sadece kodlama yaparken değil, yarış ve simülasyon oyunlarında da harika bir performans veriyor.",
    score: 8.9,
    pros: [
      "Kusursuz çoklu görev (multitasking) deneyimi",
      "Canlı ve doğru renk profili (IPS)",
    ],
    cons: ["HDR performansı zayıf", "Masaüstünde çok alan kaplıyor"],
  },
  {
    title: "CodeCraft Pro Mekanik Klavye",
    slug: "codecraft-pro-keyboard",
    summary:
      "Uzun yazılım seansları ve rekabetçi oyunlar için tasarlanmış şaheser.",
    content:
      "Özellikle C, C# veya modern web frameworkleri ile çalışırken parmakları yormayan, aynı zamanda oyunlarda anlık tepki veren özel switch yapısı harika. Kendi yazılımı üzerinden her tuşa özel makro atanabiliyor.\n\nPBT tuş kapakları yıllarca kullanıma rağmen silinme veya parlama yapmıyor. TKL (Tenkeyless) yapısı sayesinde mouse için geniş bir alan bırakıyor.",
    score: 9.1,
    pros: [
      "PBT tuş kapaklarının kalitesi",
      "Hızlı tepki veren optik-mekanik switchler",
    ],
    cons: ["Bilek desteği kutudan çıkmıyor", "Yazılımı biraz karmaşık"],
  },
  {
    title: "Logitech G Pro X Superlight 2",
    slug: "logitech-g-pro-x-superlight-2",
    summary:
      "E-spor profesyonellerinin tercihi, tüy kadar hafif bir nişan alma canavarı.",
    content:
      "Sadece 60 gram ağırlığında olmasına rağmen kasa kalitesinden ve batarya süresinden hiçbir ödün verilmemiş. Yeni eklenen Type-C portu ve güncellenmiş Hero 2 sensörü ile hareket takibi kusursuz.\n\nElinde neredeyse yokmuş gibi hissettirmesi, FPS oyunlarında flick-shot (ani dönüş) atarken büyük bir avantaj sağlıyor.",
    score: 9.3,
    pros: [
      "İnanılmaz hafif ve dengeli yapı",
      "Kusursuz sensör takibi",
      "Uzun batarya ömrü",
    ],
    cons: ["RGB aydınlatma yok", "Fiyatı rakiplerine göre yüksek"],
  },
  {
    title: "Steam Deck OLED",
    slug: "steam-deck-oled",
    summary:
      "PC oyunculuğunu yatağınıza ve seyahatlerinize taşıyan kusursuz cihaz.",
    content:
      "OLED ekranın getirdiği sonsuz siyahlar ve canlı renkler, oyunların atmosferini tamamen değiştiriyor. Ayrıca yenilenen batarya yapısı sayesinde kullanım süresi ilk versiyona göre %40 civarında artırılmış.\n\nSadece bir konsol değil, arka planda çalışan Linux mimarisi sayesinde tam teşekküllü bir el bilgisayarı. Terminal üzerinden istediğiniz modifikasyonu yapabilirsiniz.",
    score: 9.4,
    pros: [
      "Muazzam HDR OLED ekran",
      "Geliştirilmiş batarya süresi",
      "Linux tabanlı özgür işletim sistemi",
    ],
    cons: ["Ağır AAA oyunlarda hala zorlanabiliyor", "Biraz ağır ve büyük"],
  },
  {
    title: "Samsung 990 Pro 2TB NVMe SSD",
    slug: "samsung-990-pro-ssd",
    summary:
      "Yükleme ekranlarını tarihe gömen, sisteminize çağ atlatan depolama çözümü.",
    content:
      "PCIe 4.0 arayüzünün sınırlarını zorlayan okuma/yazma hızlarına sahip. Özellikle ağır oyun motorlarında proje derlerken veya devasa boyuttaki oyunları açarken saniyeler içinde işlem bitiyor.\n\nÜzerindeki grafen kaplama sayesinde soğutuculu bir anakartta kullanıldığında ısı problemi yaşamadan saatlerce tam performansta çalışabiliyor.",
    score: 9.5,
    pros: ["Sektördeki en yüksek okuma/yazma hızları", "Başarılı ısı yönetimi"],
    cons: ["PCIe 5.0 olmaması ileriye dönüklüğü kısıtlıyor"],
  },
  {
    title: "SteelSeries Arctis Nova Pro Wireless",
    slug: "arctis-nova-pro-wireless",
    summary:
      "Hem oyuncular hem de odyofiller için tasarlanmış kusursuz ses sistemi.",
    content:
      "Aktif Gürültü Engelleme (ANC) özelliği sayesinde dış dünyadan tamamen kopmanızı sağlıyor. Yanında gelen DAC (Dijital Analog Dönüştürücü) ünitesi üzerinden EQ ayarlarını saniyeler içinde değiştirebilirsiniz.\n\nEn güzel özelliği ise biten pili oyunun ortasında kulaklıktan çıkarıp ünitedeki dolu pille 5 saniye içinde değiştirebilmeniz. Şarj derdini tamamen bitiriyor.",
    score: 9.0,
    pros: [
      "Sonsuz batarya sistemi (değiştirilebilir pil)",
      "Mükemmel uzamsal ses kasma kalitesi",
    ],
    cons: [
      "Kulak pedleri yaz aylarında terletiyor",
      "Mikrofon kalitesi kulaklık fiyatına göre ortalama",
    ],
  },
  {
    title: "IoT NodeMaster ESP8266 Geliştirme Kiti",
    slug: "iot-nodemaster-esp8266",
    summary:
      "Donanım tutkunları ve sistem mühendisleri için rakipsiz bir IoT altyapısı.",
    content:
      "Master-Slave ağ mimarileri kurmak, özel donanım projeleri tasarlamak için biçilmiş kaftan. Özellikle ultrasonik sensörler kullanarak hacimsel verileri anlık takip etmek isteyen geliştiriciler için çok stabil bir altyapı.\n\nYazılımla donanımın kesiştiği noktada kendi otomasyon sistemlerinizi veya küçük akıllı asistan donanımlarınızı prototiplemek için harika bir başlangıç noktası.",
    score: 8.6,
    pros: [
      "Master-Slave ağ kurulumunda kusursuz stabilite",
      "Düşük güç tüketimi ve modüler yapı",
    ],
    cons: [
      "Pin lehimleri hassas",
      "Dahili hafızası ağır projeler için kısıtlı",
    ],
  },
];

async function seedData() {
  console.log(
    "🚀 Strapi'ye 18 adet yepyeni veri (Blocks uyumlu) gönderiliyor...",
  );

  for (const review of mockReviews) {
    try {
      // Düz metin olan content'i Strapi Blocks objesine çeviriyoruz
      const formattedReview = {
        ...review,
        content: formatToStrapiBlocks(review.content),
      };

      await axios.post(STRAPI_URL, { data: formattedReview });
      console.log(`✅ Başarılı: ${review.title} (${review.score}/10)`);
    } catch (error) {
      console.error(
        `❌ Hata (${review.title}):`,
        error.response?.data?.error?.message || error.message,
      );
    }
  }

  console.log("🎉 Tüm veri aktarımı tamamlandı! Ekranı yenileyebilirsin.");
}

seedData();
