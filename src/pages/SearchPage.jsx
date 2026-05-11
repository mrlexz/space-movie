import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "../hooks/useMovies";
import MovieCard from "../components/movie/MovieCard";
import { CardSkeleton } from "../components/ui/Skeleton";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { results, loading, totalResults } = useSearch(query);

  return (
    <>
      <Helmet>
        <title>Search — SPACEMOVIE</title>
      </Helmet>

      <div className="min-h-screen pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
            <h1 className="font-display text-5xl text-white tracking-wider mb-6">SEARCH</h1>
            <div className="relative max-w-xl mx-auto">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cinema-sub" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search movies, TV shows, anime..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full bg-cinema-card border border-cinema-border rounded-xl py-4 pl-12 pr-4 text-white placeholder-cinema-muted outline-none focus:border-cinema-accent transition-colors text-lg"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-cinema-sub hover:text-white">
                  ✕
                </button>
              )}
            </div>
            {totalResults > 0 && (
              <p className="text-cinema-sub mt-3 text-sm">{totalResults} results for "{query}"</p>
            )}
          </motion.div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : results.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
              >
                {results.map((item, i) => <MovieCard key={item.id} movie={item} index={i} />)}
              </motion.div>
            ) : query.length >= 2 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-white text-xl font-semibold mb-2">No results found</h3>
                <p className="text-cinema-sub">Try a different search term</p>
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-white text-xl font-semibold mb-2">Start searching</h3>
                <p className="text-cinema-sub">Type at least 2 characters to search</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
