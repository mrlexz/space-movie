import { useState, useEffect, useCallback, useRef } from "react";
import movieService from "../services/movieService";

// Generic fetch hook
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    setLoading(true);
    setError(null);

    fetchFn()
      .then((result) => {
        if (isMounted.current) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted.current) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

// Trending for hero
export function useTrending() {
  return useFetch(() => movieService.getTrending(), []);
}

// Paginated list hook
export function usePaginatedMovies(fetchFn, initialPage = 1) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(
    async (pageNum, append = false) => {
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        const result = await fetchFn(pageNum);
        if (append) {
          setMovies((prev) => [...prev, ...result.results]);
        } else {
          setMovies(result.results);
        }
        setHasMore(pageNum < result.total_pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchFn]
  );

  useEffect(() => {
    setMovies([]);
    setPage(1);
    fetchMovies(1, false);
  }, [fetchMovies]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage, true);
  }, [page, fetchMovies]);

  return { movies, loading, loadingMore, hasMore, error, loadMore };
}

// Movie detail hook
export function useMovieDetail(id, type = "movie") {
  const fetchFn = type === "movie"
    ? () => movieService.getMovieDetail(id)
    : () => movieService.getTVDetail(id);
  return useFetch(fetchFn, [id, type]);
}

// Search hook with debounce
export function useSearch(query, page = 1) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await movieService.search(query, page);
        setResults(data.results);
        setTotalResults(data.total_results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceTimer.current);
  }, [query, page]);

  return { results, loading, totalResults };
}
