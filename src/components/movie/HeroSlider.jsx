import { useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import { useTrending } from "../../hooks/useMovies";
import { HeroSkeleton } from "../ui/Skeleton";

const GENRES_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  18: "Drama", 27: "Horror", 878: "Sci-Fi", 53: "Thriller",
  10765: "Sci-Fi & Fantasy", 10759: "Action & Adventure",
};

export default function HeroSlider() {
  const { data: movies, loading } = useTrending();
  const progressRef = useRef(null);

  if (loading) return <HeroSkeleton />;
  if (!movies?.length) return null;

  return (
    <div className="relative h-[90vh] min-h-[580px] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        className="h-full"
        onAutoplayTimeLeft={(_, __, percentage) => {
          if (progressRef.current) {
            progressRef.current.style.width = `${(1 - percentage) * 100}%`;
          }
        }}
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={movie.id}>
            <HeroSlide movie={movie} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
        <div ref={progressRef} className="h-full bg-cinema-accent transition-all duration-100 ease-linear" style={{ width: "0%" }} />
      </div>
    </div>
  );
}

function HeroSlide({ movie, index }) {
  const genres = movie.genre_ids?.slice(0, 3).map((id) => GENRES_MAP[id]).filter(Boolean) || [];
  const isTV = movie.media_type === "tv";
  const linkTo = `/${isTV ? "tv" : "movie"}/${movie.id}`;

  return (
    <div className="relative h-full">
      {/* Background */}
      <div className="absolute inset-0">
        {movie.backdrop_path ? (
          <img
            src={movie.backdrop_path}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-cinema-dark" />
        )}
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-black via-cinema-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/20 to-transparent" />
        <div className="absolute inset-0 bg-cinema-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            {/* Top 10 badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="bg-cinema-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                #{index + 1} Trending
              </span>
              <span className={`badge ${isTV ? "bg-blue-500/30 text-blue-400 border border-blue-500/30" : "bg-cinema-accent/20 text-cinema-accent border border-cinema-accent/30"}`}>
                {isTV ? "TV Show" : "Movie"}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-none tracking-wide text-shadow mb-4"
            >
              {movie.title}
            </motion.h1>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4 mb-4"
            >
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-1.5 bg-cinema-gold/10 border border-cinema-gold/30 rounded-full px-3 py-1">
                  <svg className="w-4 h-4 text-cinema-gold fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-cinema-gold font-bold text-sm">{movie.vote_average.toFixed(1)}</span>
                </div>
              )}
              {movie.release_date && (
                <span className="text-cinema-sub text-sm">{movie.release_date.slice(0, 4)}</span>
              )}
              {genres.map((g) => (
                <span key={g} className="text-cinema-sub text-sm border-l border-cinema-sub/30 pl-4">{g}</span>
              ))}
            </motion.div>

            {/* Overview */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-cinema-sub leading-relaxed line-clamp-3 mb-8 text-sm sm:text-base"
            >
              {movie.overview}
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <Link to={`/watch/${isTV ? "tv" : "movie"}/${movie.id}`} className="btn-primary text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Now
              </Link>
              <Link to={linkTo} className="btn-secondary text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                More Info
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
