import { useCallback, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { usePaginatedMovies } from "../hooks/useMovies";
import MovieCard from "../components/movie/MovieCard";
import { CardSkeleton } from "../components/ui/Skeleton";

export function MovieListPage({ title, fetchFn, helmetTitle }) {
  const stableFetchFn = useCallback(fetchFn, []);
  const { movies, loading, loadingMore, hasMore, loadMore } = usePaginatedMovies(stableFetchFn);
  const loaderRef = useRef(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadMore]);

  return (
    <>
      <Helmet>
        <title>{helmetTitle || title} — SPACEMOVIE</title>
      </Helmet>

      <div className="min-h-screen pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-cinema-accent rounded-full" />
              <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider">{title}</h1>
            </div>
            <p className="text-cinema-sub ml-4">
              {movies.length > 0 ? `${movies.length} titles loaded` : "Loading..."}
            </p>
          </motion.div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 18 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            >
              {movies.map((movie, i) => (
                <MovieCard key={`${movie.id}-${i}`} movie={movie} index={i % 18} />
              ))}
            </motion.div>
          )}

          {/* Loader trigger */}
          <div ref={loaderRef} className="mt-8">
            {loadingMore && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            )}
            {!hasMore && movies.length > 0 && (
              <p className="text-center text-cinema-sub py-8">You've reached the end</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Specialized pages
import movieService from "../services/movieService";

export function MoviesPage() {
  return <MovieListPage title="Movies" fetchFn={(p) => movieService.getPopularMovies(p)} helmetTitle="Movies" />;
}

export function TVShowsPage() {
  return <MovieListPage title="TV Shows" fetchFn={(p) => movieService.getPopularTV(p)} helmetTitle="TV Shows" />;
}

export function TopRatedPage() {
  return <MovieListPage title="Top IMDB" fetchFn={(p) => movieService.getTopRated(p)} helmetTitle="Top Rated" />;
}

export function AnimePage() {
  return <MovieListPage title="Anime" fetchFn={(p) => movieService.getAnime(p)} helmetTitle="Anime" />;
}
