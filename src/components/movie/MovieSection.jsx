import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MovieCard from "./MovieCard";
import { MovieGridSkeleton } from "../ui/Skeleton";

export default function MovieSection({ title, movies, loading, viewAllLink, accentColor = "cinema-accent" }) {
  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-1 h-8 bg-${accentColor} rounded-full`} />
          <h2 className="section-title">{title}</h2>
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-cinema-sub text-sm hover:text-white transition-colors flex items-center gap-1"
          >
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {loading ? (
        <MovieGridSkeleton count={6} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          {movies?.slice(0, 12).map((movie, i) => (
            <MovieCard key={movie.id} movie={movie} index={i} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
