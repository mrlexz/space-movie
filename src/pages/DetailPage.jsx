import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useMovieDetail } from "../hooks/useMovies";
import { DetailSkeleton } from "../components/ui/Skeleton";
import MovieCard from "../components/movie/MovieCard";

const POSTER_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' fill='%231e1e2e'%3E%3Crect width='200' height='300'/%3E%3C/svg%3E";

export default function DetailPage({ mediaType = "movie" }) {
  const { id } = useParams();
  const { data: movie, loading } = useMovieDetail(id, mediaType);

  if (loading) return <DetailSkeleton />;
  if (!movie) return <div className="min-h-screen flex items-center justify-center text-cinema-sub">Movie not found</div>;

  const year = movie.release_date?.slice(0, 4);
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;

  return (
    <>
      <Helmet>
        <title>{movie.title} — SPACEMOVIE</title>
        <meta name="description" content={movie.overview?.slice(0, 160)} />
      </Helmet>

      {/* Backdrop Hero */}
      <div className="relative h-[65vh] min-h-[400px] overflow-hidden">
        {movie.backdrop_path && (
          <img src={movie.backdrop_path} alt={movie.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-black/60 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-48 z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-shrink-0"
            >
              <img
                src={movie.poster_path || POSTER_PLACEHOLDER}
                alt={movie.title}
                className="w-44 md:w-56 rounded-2xl shadow-2xl shadow-black/50 mx-auto md:mx-0"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 pt-4 md:pt-20"
            >
              {/* Title */}
              <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide mb-2">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-cinema-sub italic mb-4">{movie.tagline}</p>
              )}

              {/* Meta badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-1.5 bg-cinema-gold/10 border border-cinema-gold/30 rounded-full px-3 py-1.5">
                    <svg className="w-4 h-4 text-cinema-gold fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-cinema-gold font-bold">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-cinema-sub text-sm">/10</span>
                  </div>
                )}
                {year && <span className="badge bg-cinema-card border border-cinema-border text-cinema-text">{year}</span>}
                {runtime && <span className="badge bg-cinema-card border border-cinema-border text-cinema-text">{runtime}</span>}
                {movie.status && <span className="badge bg-green-500/20 text-green-400 border border-green-500/20">{movie.status}</span>}
                {mediaType === "tv" && movie.number_of_seasons && (
                  <span className="badge bg-blue-500/20 text-blue-400 border border-blue-500/20">
                    {movie.number_of_seasons} Season{movie.number_of_seasons > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Genres */}
              {movie.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((g) => (
                    <span key={g.id} className="px-3 py-1 bg-cinema-border text-cinema-sub text-sm rounded-full hover:bg-cinema-accent hover:text-white transition-colors cursor-pointer">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <p className="text-cinema-sub leading-relaxed mb-8 max-w-2xl">{movie.overview}</p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/watch/${mediaType}/${id}`}
                  className="btn-primary"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Now
                </Link>
                {movie.trailerKey && (
                  <a
                    href={`https://www.youtube.com/watch?v=${movie.trailerKey}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Trailer
                  </a>
                )}
              </div>
            </motion.div>
          </div>

          {/* Trailer */}
          {movie.trailerKey && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-7 bg-cinema-accent rounded-full" />
                <h2 className="section-title text-2xl">Official Trailer</h2>
              </div>
              <div className="video-wrapper rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${movie.trailerKey}?rel=0`}
                  title="Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-2xl"
                />
              </div>
            </motion.section>
          )}

          {/* Cast */}
          {movie.cast?.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-7 bg-cinema-accent rounded-full" />
                <h2 className="section-title text-2xl">Cast</h2>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {movie.cast.map((person) => (
                  <div key={person.id} className="text-center">
                    <div className="w-full aspect-square rounded-full overflow-hidden bg-cinema-card mb-2">
                      {person.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cinema-muted text-2xl">
                          👤
                        </div>
                      )}
                    </div>
                    <p className="text-white text-xs font-semibold leading-tight">{person.name}</p>
                    <p className="text-cinema-sub text-xs mt-0.5 line-clamp-2">{person.character}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* TV Seasons */}
          {mediaType === "tv" && movie.seasons?.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-7 bg-blue-500 rounded-full" />
                <h2 className="section-title text-2xl">Seasons</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movie.seasons.filter((s) => s.season_number > 0).map((season) => (
                  <div key={season.id} className="bg-cinema-card rounded-xl overflow-hidden border border-cinema-border hover:border-cinema-accent transition-colors group">
                    <div className="aspect-[2/3] overflow-hidden">
                      {season.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                          alt={season.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-cinema-border flex items-center justify-center text-cinema-muted">
                          S{season.season_number}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-white text-sm font-semibold">{season.name}</p>
                      <p className="text-cinema-sub text-xs mt-1">{season.episode_count} episodes</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Similar */}
          {movie.similar?.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 pb-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-7 bg-cinema-accent rounded-full" />
                <h2 className="section-title text-2xl">You Might Also Like</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movie.similar.map((m, i) => (
                  <MovieCard key={m.id} movie={{ ...m, media_type: mediaType }} index={i} />
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </>
  );
}
