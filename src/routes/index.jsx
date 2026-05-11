import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/HomePage";
import { MoviesPage, TVShowsPage, TopRatedPage, AnimePage } from "../pages/MovieListPage";
import DetailPage from "../pages/DetailPage";
import WatchPage from "../pages/WatchPage";
import SearchPage from "../pages/SearchPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "movies", element: <MoviesPage /> },
      { path: "tv", element: <TVShowsPage /> },
      { path: "top-rated", element: <TopRatedPage /> },
      { path: "anime", element: <AnimePage /> },
      { path: "movie/:id", element: <DetailPage mediaType="movie" /> },
      { path: "tv/:id", element: <DetailPage mediaType="tv" /> },
      { path: "search", element: <SearchPage /> },
    ],
  },
  {
    path: "/watch/:type/:id",
    element: <WatchPage />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
