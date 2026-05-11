import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useMovieDetail } from "../hooks/useMovies";

export default function WatchPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { data: movie, loading } = useMovieDetail(id, type);

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(`/${type}/${id}`);
    }
  };

  const servers = useMemo(() => movie?.episodes || [], [movie]);
  const [prevId, setPrevId] = useState(id);
  const [serverIdx, setServerIdx] = useState(0);
  const [episodeSlug, setEpisodeSlug] = useState(null);

  if (prevId !== id) {
    setPrevId(id);
    setServerIdx(0);
    setEpisodeSlug(null);
  }

  const activeServer = servers[serverIdx];
  const episodes = activeServer?.server_data || [];
  const activeEpisode =
    episodes.find((ep) => ep.slug === episodeSlug) || episodes[0] || null;
  const playerUrl = activeEpisode?.link_embed || "";

  return (
    <>
      <Helmet>
        <title>{movie?.title ? `Watching: ${movie.title}` : "Watch"} — SPACEMOVIE</title>
      </Helmet>

      <div className="min-h-screen bg-cinema-black pt-16">
        {/* Top bar with back button */}
        <div className="fixed top-0 inset-x-0 z-40 bg-cinema-black/80 backdrop-blur border-b border-cinema-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
            <button
              onClick={handleBack}
              className="btn-secondary text-sm"
              aria-label="Quay lại"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </button>

            <Link to="/" className="font-display text-cinema-gold text-xl tracking-wider hidden sm:block">
              SPACEMOVIE
            </Link>

            <Link to="/" className="btn-secondary text-sm" aria-label="Trang chủ">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M5 10v10h14V10" />
              </svg>
              <span className="hidden sm:inline">Trang chủ</span>
            </Link>
          </div>
        </div>

        {/* Player */}
        <div className="bg-black w-full">
          <div className="max-w-7xl mx-auto">
            <div className="video-wrapper" style={{ paddingBottom: "56.25%", position: "relative", height: 0 }}>
              {playerUrl ? (
                <iframe
                  src={playerUrl}
                  allowFullScreen
                  allow="autoplay; fullscreen"
                  title={activeEpisode?.name || "Movie Player"}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-cinema-sub text-sm">
                  {loading ? "Loading player..." : "Không có nguồn phát cho phim này."}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Movie Info below player */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="space-y-3">
              <div className="h-8 bg-cinema-card rounded w-1/3 skeleton" />
              <div className="h-4 bg-cinema-card rounded w-1/4 skeleton" />
            </div>
          ) : movie ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              {/* Thumbnail */}
              {movie.poster_path && (
                <img src={movie.poster_path} alt={movie.title} className="w-24 h-36 object-cover rounded-xl flex-shrink-0 hidden sm:block" />
              )}

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="font-display text-3xl text-white tracking-wide">{movie.title}</h1>
                    <div className="flex items-center gap-3 mt-2">
                      {movie.release_date && (
                        <span className="text-cinema-sub text-sm">{movie.release_date.slice(0, 4)}</span>
                      )}
                      {movie.vote_average > 0 && (
                        <span className="text-cinema-gold text-sm flex items-center gap-1">
                          ★ {movie.vote_average.toFixed(1)}
                        </span>
                      )}
                      {movie.genres?.map((g) => (
                        <span key={g.id} className="badge bg-cinema-card border border-cinema-border text-cinema-sub">{g.name}</span>
                      ))}
                    </div>
                    <p className="text-cinema-sub text-sm mt-3 leading-relaxed max-w-2xl line-clamp-3">
                      {movie.overview}
                    </p>
                  </div>

                  <Link
                    to={`/${type}/${id}`}
                    className="btn-secondary flex-shrink-0 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    More Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Episodes */}
          {servers.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-7 bg-cinema-accent rounded-full" />
                <h2 className="section-title text-2xl">Danh sách tập</h2>
              </div>

              {servers.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {servers.map((srv, i) => (
                    <button
                      key={srv.server_name + i}
                      onClick={() => {
                        setServerIdx(i);
                        setEpisodeSlug(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        i === serverIdx
                          ? "bg-cinema-accent text-white border-cinema-accent"
                          : "bg-cinema-card text-cinema-sub border-cinema-border hover:border-cinema-accent"
                      }`}
                    >
                      {srv.server_name}
                    </button>
                  ))}
                </div>
              )}

              {episodes.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-2">
                  {episodes.map((ep) => {
                    const isActive = (activeEpisode?.slug || episodes[0]?.slug) === ep.slug;
                    return (
                      <button
                        key={ep.slug}
                        onClick={() => setEpisodeSlug(ep.slug)}
                        title={ep.name}
                        className={`px-2 py-2 rounded-lg text-sm font-medium border transition-colors truncate ${
                          isActive
                            ? "bg-cinema-accent text-white border-cinema-accent"
                            : "bg-cinema-card text-cinema-text border-cinema-border hover:border-cinema-accent hover:text-white"
                        }`}
                      >
                        {ep.name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-cinema-sub text-sm">Server này chưa có tập nào.</p>
              )}
            </motion.section>
          )}

          {/* Notice */}
          <div className="mt-6 p-4 bg-cinema-card rounded-xl border border-cinema-border">
            <p className="text-cinema-sub text-sm flex items-center gap-2">
              <svg className="w-4 h-4 text-cinema-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Video content is provided by third-party embeds. If video doesn't load, try refreshing or use a VPN.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
