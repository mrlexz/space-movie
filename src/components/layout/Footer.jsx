import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-cinema-dark border-t border-cinema-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-cinema-accent rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <span className="font-display text-2xl text-white tracking-wider">SPACEMOVIE</span>
            </div>
            <p className="text-cinema-sub text-sm leading-relaxed max-w-xs">
              Your ultimate destination for movies, TV shows, and anime. Discover, explore, and enjoy the best of cinema.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Browse</h4>
            <ul className="space-y-2">
              {[
                { label: "Movies", to: "/movies" },
                { label: "TV Shows", to: "/tv" },
                { label: "Top Rated", to: "/top-rated" },
                { label: "Anime", to: "/anime" },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-cinema-sub text-sm hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Info</h4>
            <ul className="space-y-2">
              {["About", "Privacy Policy", "Terms of Service", "Contact"].map((item) => (
                <li key={item}>
                  <span className="text-cinema-sub text-sm hover:text-white transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cinema-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-cinema-muted text-xs">
            © 2026 SPACEMOVIE. Movie data provided by{" "}
            <a href="https://www.lexnguyen.dev/" target="_blank" rel="noreferrer" className="text-cinema-accent hover:underline">
              lexnguyen
            </a>
            .
          </p>
          {/* <div className="flex items-center gap-4">
            {["Twitter", "Discord", "Instagram"].map((s) => (
              <span key={s} className="text-cinema-muted text-xs hover:text-white cursor-pointer transition-colors">{s}</span>
            ))}
          </div> */}
        </div>
      </div>
    </footer>
  );
}
