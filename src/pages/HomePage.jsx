import { useCallback } from "react";
import { Helmet } from "react-helmet-async";
import HeroSlider from "../components/movie/HeroSlider";
import MovieSection from "../components/movie/MovieSection";
import { useFetch } from "../hooks/useMovies";
import movieService from "../services/movieService";

export default function HomePage() {
  const trendingFn = useCallback(() => movieService.getTrending(), []);
  const popularFn = useCallback(() => movieService.getPopularMovies(1), []);
  const tvFn = useCallback(() => movieService.getPopularTV(1), []);
  const animeFn = useCallback(() => movieService.getAnime(1), []);
  const topFn = useCallback(() => movieService.getTopRated(1), []);

  const { data: trendingData, loading: tl } = useFetch(trendingFn, []);
  const { data: popularData, loading: pl } = useFetch(popularFn, []);
  const { data: tvData, loading: tvl } = useFetch(tvFn, []);
  const { data: animeData, loading: al } = useFetch(animeFn, []);
  const { data: topData, loading: topl } = useFetch(topFn, []);

  return (
    <>
      <Helmet>
        <title>SPACEMOVIE — Watch Movies & TV Shows</title>
        <meta name="description" content="Discover and watch the best movies, TV shows, and anime on SPACEMOVIE." />
      </Helmet>

      {/* Hero */}
      <HeroSlider />

      {/* Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <MovieSection
          title="Trending Now"
          movies={trendingData}
          loading={tl}
          viewAllLink="/movies"
        />

        {/* <MovieSection
          title="Latest Movies"
          movies={popularData?.results}
          loading={pl}
          viewAllLink="/movies"
          accentColor="cinema-accent"
        />

        <MovieSection
          title="TV Series"
          movies={tvData?.results}
          loading={tvl}
          viewAllLink="/tv"
          accentColor="blue-500"
        /> */}

        <MovieSection
          title="Anime"
          movies={animeData?.results}
          loading={al}
          viewAllLink="/anime"
          accentColor="purple-500"
        />

        <MovieSection
          title="Top IMDB"
          movies={topData?.results}
          loading={topl}
          viewAllLink="/top-rated"
          accentColor="cinema-gold"
        />
      </div>
    </>
  );
}
