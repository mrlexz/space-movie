import axios from "axios";
import { MOCK_MOVIES, MOCK_TV_SHOWS, MOCK_ANIME } from "../utils/mockData";

export const POSTER_URL = 'https://phimimg.com'

// ============================================================
// Base config — KKPhim API (phimapi.com)
// ============================================================
const BASE_URL = "https://phimapi.com";
export const CDN_IMAGE = (url) => {
  const flatUrl = url?.includes(POSTER_URL) ? url : `${POSTER_URL}/${url}`;
  const res = flatUrl ? flatUrl : `https://phimapi.com/image.php?url=${encodeURIComponent(flatUrl)}`
  return res
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
});

// ============================================================
// Normalizer — KKPhim item → format chung của app
// ============================================================
export const normalizeMovie = (item) => ({
  id: item._id || item.id,
  slug: item.slug,
  title: item.name || item.origin_name,
  origin_title: item.origin_name || item.name,
  overview: item.content || "",
  poster_path: item.poster_url ? CDN_IMAGE(item.poster_url) : item.thumb_url ? CDN_IMAGE(item.thumb_url) : null,
  thumb_path: item.thumb_url ? CDN_IMAGE(item.thumb_url) : null,
  backdrop_path: item.thumb_url ? CDN_IMAGE(item.thumb_url) : item.poster_url ? CDN_IMAGE(item.poster_url) : null,
  vote_average: item.tmdb?.vote_average || 0,
  vote_count: item.tmdb?.vote_count || 0,
  release_date: item.year ? `${item.year}-01-01` : null,
  year: item.year,
  genres: item.category?.map((c) => ({ id: c.id, name: c.name, slug: c.slug })) || [],
  genre_ids: item.category?.map((c) => c.id) || [],
  countries: item.country?.map((c) => ({ name: c.name, slug: c.slug })) || [],
  media_type: item.type === "single" ? "movie" : "tv",
  type: item.type,
  episode_current: item.episode_current || "",
  episode_total: item.episode_total || "",
  status: item.status || "",
  lang: item.lang || "",
  quality: item.quality || "",
  time: item.time || "",
  tmdb_id: item.tmdb?.id || null,
  actor: item.actor || [],
  director: item.director || [],
});

const normalizeDetail = (data) => ({
  ...normalizeMovie(data.movie || data),
  episodes: data.episodes || [],
  trailer_url: data.movie?.trailer_url || null,
  chieurap: data.movie?.chieurap || false,
  tagline: data.movie?.content?.slice(0, 100) || "",
});

const parsePagination = (data) => {
  const pagination = data?.data?.params?.pagination || {};
  const items = data?.data?.items || [];
  return {
    results: items.map(normalizeMovie),
    total_pages: pagination.totalPages || 1,
    total_items: pagination.totalItems || items.length,
    current_page: pagination.currentPage || 1,
  };
};

// Mock fallbacks
const mockFallback = (arr, type = "movie") => ({
  results: arr.map((m) => ({ ...m, slug: String(m.id), media_type: type })),
  total_pages: 1, total_items: arr.length, current_page: 1,
});

// ============================================================
// API Service
// ============================================================
const movieService = {

  // 1. Phim mới cập nhật — GET /danh-sach/phim-moi-cap-nhat?page=
  getNewUpdated: async (page = 1) => {
    try {
      const { data } = await api.get(`/danh-sach/phim-moi-cap-nhat?page=${page}`);
      const items = data?.items || [];
      const pagination = data?.pagination || {};
      return {
        results: items.map(normalizeMovie),
        total_pages: pagination.totalPages || 1,
        total_items: pagination.totalItems || items.length,
        current_page: pagination.currentPage || page,
      };
    } catch {
      return mockFallback(MOCK_MOVIES, "movie");
    }
  },

  // Hero slider — lấy 10 phim mới nhất
  getTrending: async () => {
    try {
      const res = await movieService.getNewUpdated(1);
      return res.results.slice(0, 10);
    } catch {
      return [
        ...MOCK_MOVIES.slice(0, 5).map((m) => ({ ...m, slug: String(m.id), media_type: "movie" })),
        ...MOCK_TV_SHOWS.slice(0, 5).map((m) => ({ ...m, slug: String(m.id), media_type: "tv" })),
      ];
    }
  },

  // 2. Danh sách tổng hợp — GET /v1/api/danh-sach/{type_list}
  //    type_list: phim-bo | phim-le | tv-shows | hoat-hinh | phim-vietsub | phim-long-tieng
  getList: async (typeList, page = 1, options = {}) => {
    const {
      sort_field = "modified.time", sort_type = "desc",
      sort_lang = "", category = "", country = "", year = "", limit = 24,
    } = options;
    try {
      const params = new URLSearchParams({ page, limit, sort_field, sort_type });
      if (sort_lang) params.append("sort_lang", sort_lang);
      if (category) params.append("category", category);
      if (country) params.append("country", country);
      if (year) params.append("year", year);
      const { data } = await api.get(`/v1/api/danh-sach/${typeList}?${params}`);
      return parsePagination(data);
    } catch {
      if (typeList === "hoat-hinh") return mockFallback(MOCK_ANIME, "tv");
      if (typeList === "phim-le") return mockFallback(MOCK_MOVIES, "movie");
      return mockFallback(MOCK_TV_SHOWS, "tv");
    }
  },

  // Shorthand cho từng loại
  getPopularMovies: (page, opts) => movieService.getList("phim-le", page, opts),
  getPopularTV:     (page, opts) => movieService.getList("phim-bo", page, opts),
  getPhimLe:        (page, opts) => movieService.getList("phim-le", page, opts),
  getPhimBo:        (page, opts) => movieService.getList("phim-bo", page, opts),
  getTVShows:       (page, opts) => movieService.getList("tv-shows", page, opts),
  getAnime:         (page, opts) => movieService.getList("hoat-hinh", page, opts),

  // Top rated — sort theo vote_average từ dữ liệu mới nhất
  getTopRated: async (page = 1) => {
    try {
      const res = await movieService.getNewUpdated(page);
      return { ...res, results: [...res.results].sort((a, b) => b.vote_average - a.vote_average) };
    } catch {
      return mockFallback(
        [...MOCK_MOVIES].sort((a, b) => b.vote_average - a.vote_average),
        "movie"
      );
    }
  },

  // 3. Chi tiết phim + tập phim — GET /phim/{slug}
  //    Response: { status, movie: {...}, episodes: [{server_name, server_data:[{name,slug,link_m3u8,link_embed}]}] }
  getMovieDetail: async (slug) => {
    try {
      const { data } = await api.get(`/phim/${slug}`);
      if (!data?.movie) throw new Error("Not found");
      return normalizeDetail(data);
    } catch {
      const mock = MOCK_MOVIES[0];
      return {
        ...mock, slug,
        media_type: "movie",
        genres: [{ id: "hanh-dong", name: "Hành Động", slug: "hanh-dong" }],
        episodes: [], trailer_url: null, actor: [], director: [],
        quality: "FHD", lang: "Vietsub",
      };
    }
  },

  // TV dùng chung endpoint
  getTVDetail: (slug) => movieService.getMovieDetail(slug),

  // 4. Tìm kiếm — GET /v1/api/tim-kiem?keyword=&page=&limit=
  search: async (keyword, page = 1, options = {}) => {
    const { limit = 24, category = "", country = "", year = "" } = options;
    try {
      const params = new URLSearchParams({ keyword, page, limit });
      if (category) params.append("category", category);
      if (country) params.append("country", country);
      if (year) params.append("year", year);
      const { data } = await api.get(`/v1/api/tim-kiem?${params}`);
      return parsePagination(data);
    } catch {
      const all = [
        ...MOCK_MOVIES.map((m) => ({ ...m, slug: String(m.id), media_type: "movie" })),
        ...MOCK_TV_SHOWS.map((m) => ({ ...m, slug: String(m.id), media_type: "tv" })),
        ...MOCK_ANIME.map((m) => ({ ...m, slug: String(m.id), media_type: "tv" })),
      ];
      const filtered = all.filter((m) =>
        (m.title || "").toLowerCase().includes((keyword || "").toLowerCase())
      );
      return { results: filtered, total_pages: 1, total_items: filtered.length };
    }
  },

  // 5. Thể loại — GET /the-loai & /v1/api/the-loai/{slug}
  getCategories: async () => {
    try {
      const { data } = await api.get("/the-loai");
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  },

  getByCategory: async (categorySlug, page = 1, options = {}) => {
    const { limit = 24, country = "", year = "", sort_field = "modified.time", sort_type = "desc" } = options;
    try {
      const params = new URLSearchParams({ page, limit, sort_field, sort_type });
      if (country) params.append("country", country);
      if (year) params.append("year", year);
      const { data } = await api.get(`/v1/api/the-loai/${categorySlug}?${params}`);
      return parsePagination(data);
    } catch { return mockFallback(MOCK_MOVIES, "movie"); }
  },

  // 6. Quốc gia — GET /quoc-gia & /v1/api/quoc-gia/{slug}
  getCountries: async () => {
    try {
      const { data } = await api.get("/quoc-gia");
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  },

  getByCountry: async (countrySlug, page = 1, options = {}) => {
    const { limit = 24, category = "", year = "", sort_field = "modified.time", sort_type = "desc" } = options;
    try {
      const params = new URLSearchParams({ page, limit, sort_field, sort_type });
      if (category) params.append("category", category);
      if (year) params.append("year", year);
      const { data } = await api.get(`/v1/api/quoc-gia/${countrySlug}?${params}`);
      return parsePagination(data);
    } catch { return mockFallback(MOCK_MOVIES, "movie"); }
  },

  // 7. Năm phát hành — GET /v1/api/nam/{year}
  getByYear: async (year, page = 1, options = {}) => {
    const { limit = 24, category = "", country = "", sort_field = "modified.time", sort_type = "desc" } = options;
    try {
      const params = new URLSearchParams({ page, limit, sort_field, sort_type });
      if (category) params.append("category", category);
      if (country) params.append("country", country);
      const { data } = await api.get(`/v1/api/nam/${year}?${params}`);
      return parsePagination(data);
    } catch { return mockFallback(MOCK_MOVIES, "movie"); }
  },

  // 8. TMDB ID lookup — GET /tmdb/{type}/{id}
  getByTmdbId: async (type, tmdbId) => {
    try {
      const { data } = await api.get(`/tmdb/${type}/${tmdbId}`);
      if (!data?.movie) throw new Error("Not found");
      return normalizeDetail(data);
    } catch { return null; }
  },
};

export default movieService;