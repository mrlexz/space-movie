import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";

const POSTER_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' fill='%231e1e2e'%3E%3Crect width='200' height='300'/%3E%3Ctext x='50%25' y='50%25' fill='%236b7280' text-anchor='middle' dy='.3em' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function MovieCard({ movie, index = 0 }) {
  const year = movie.release_date?.slice(0, 4);
  const rating = movie.vote_average?.toFixed(1);
  const isTV = movie.media_type === "tv";
  const linkTo = `/${isTV ? "tv" : "movie"}/${movie.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={linkTo} className="block group">
        <div className="movie-card-hover relative rounded-xl overflow-hidden bg-cinema-card cursor-pointer">
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden">
            <LazyLoadImage
              src={movie.poster_path || POSTER_PLACEHOLDER}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              placeholderSrc={POSTER_PLACEHOLDER}
              effect="opacity"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-14 h-14 bg-cinema-accent rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Rating badge */}
            {rating > 0 && (
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-md px-2 py-1">
                <svg className="w-3 h-3 text-cinema-gold fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-white text-xs font-bold">{rating}</span>
              </div>
            )}

            {/* Type badge */}
            <div className={`absolute top-2 right-2 badge ${isTV ? "bg-blue-500/80 text-white" : "bg-cinema-accent/80 text-white"}`}>
              {isTV ? "TV" : "Movie"}
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 group-hover:text-cinema-accent transition-colors">
              {movie.title}
            </h3>
            <p className="text-cinema-sub text-xs mt-1">{year}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
