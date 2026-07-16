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

export default apiClient;
