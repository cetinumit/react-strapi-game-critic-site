import axios from "axios";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

const apiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getStrapiMedia = (media) => {
  if (!media) return null;

  const url = media.data?.attributes?.url || media.url || media;

  if (typeof url !== "string") return null;

  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }

  return `${STRAPI_URL}${url}`;
};

export const fetchReviews = async (categorySlug = null) => {
  try {
    let endpoint = "/reviews?populate=*";

    if (categorySlug && categorySlug !== "all") {
      endpoint += `&filters[category][slug][$eq]=${categorySlug}`;
    }

    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("İncelemeler çekilirken bir hata oluştu:", error);
    throw error;
  }
};

export const fetchReviewBySlug = async (slug) => {
  try {
    const response = await apiClient.get(
      `/reviews?filters[slug][$eq]=${slug}&populate=*`,
    );

    return response.data.data[0];
  } catch (error) {
    console.error(`"${slug}" incelemesi çekilirken hata oluştu:`, error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await apiClient.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Kategoriler çekilirken hata oluştu:", error);
    throw error;
  }
};

// Kullanıcı girişi yap ve JWT Token ile Kullanıcı bilgilerini al
export const loginUser = async (identifier, password) => {
  try {
    const response = await apiClient.post("/auth/local", {
      identifier, // Kullanıcı adı veya e-posta
      password,
    });
    // Strapi başarılı girişte { jwt: "...", user: {...} } döner
    if (response.data.jwt) {
      localStorage.setItem("jwt", response.data.jwt);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error("Giriş hatası:", error.response?.data || error.message);
    throw error;
  }
};

// Mevcut kullanıcının giriş yapıp yapmadığını kontrol eden yardımcı
export const isAuthenticated = () => {
  return !!localStorage.getItem("jwt");
};

// Mevcut kullanıcı bilgilerini getir
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Çıkış yap (Token'ı hafızadan sil)
export const logoutUser = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
};

// Yetki gerektiren istekler için Authorization header'ı oluşturan yardımcı
export const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 1. Strapi'ye Resim (Medya) Yükleme Fonksiyonu (Saf Axios Kullanımı)
export const uploadImage = async (file) => {
  try {
    const token = localStorage.getItem("jwt");

    // Eğer tarayıcıda token yoksa hiç istek atmadan direkt uyaralım:
    if (!token) {
      throw new Error(
        "Oturum süreniz dolmuş veya token bulunamadı. Lütfen tekrar giriş yapın.",
      );
    }

    const formData = new FormData();
    formData.append("files", file);

    // MİMARİ DÜZELTME: Global 'apiClient' yerine saf 'axios' kullanıyoruz.
    // Böylece JSON header'ları resim yüklememizi ve Bearer tokenımızı bozamaz!
    const response = await axios.post(`${STRAPI_URL}/api/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`, // Token'ı buraya net ve temizce basıyoruz
      },
    });

    return response.data[0].id;
  } catch (error) {
    console.error(
      "Resim yükleme hatası detayı:",
      error.response?.data || error,
    );
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      "Resim yüklenirken bir hata oluştu.";
    throw new Error(errorMessage);
  }
};

// 2. Yeni İnceleme (Review) Ekleme Fonksiyonu
export const createReview = async (reviewData) => {
  try {
    const token = localStorage.getItem("jwt");

    if (!token) {
      throw new Error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
    }

    const response = await apiClient.post(
      "/reviews",
      { data: reviewData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "İnceleme ekleme hatası detayı:",
      error.response?.data || error,
    );
    const errorMessage =
      error.response?.data?.error?.message ||
      "İnceleme eklenirken bir hata oluştu. İzinleri kontrol edin.";
    throw new Error(errorMessage);
  }
};

export default apiClient;
