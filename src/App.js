import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

// TMDB API Configuration
const API_KEY = "d61a88778a1e882c37f0ba520bbbc191";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [anime, setAnime] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [popularRes, trendingRes, animeRes, upcomingRes] =
        await Promise.all([
          axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`),
          axios.get(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=16&sort_by=popularity.desc`
          ),
          axios.get(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`),
        ]);

      setMovies(popularRes.data.results);
      setTrending(trendingRes.data.results);
      setAnime(animeRes.data.results);
      setUpcoming(upcomingRes.data.results.slice(0, 10));

      setFeatured(popularRes.data.results[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          query
        )}`
      );
      setSearchResults(response.data.results.slice(0, 6));
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      searchMovies(query);
    } else {
      setSearchResults([]);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div
          className="spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading CineVerse...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Enhanced Header */}
      <motion.header
        className={`header ${isScrolled ? "scrolled" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container">
          <div className="nav">
            <motion.div className="logo" whileHover={{ scale: 1.05 }}>
              <i className="fas fa-film"></i>
              <span>CineVerse</span>
            </motion.div>

            <nav className="nav-links">
              {["home", "movies", "anime", "trending", "upcoming"].map(
                (tab) => (
                  <motion.button
                    key={tab}
                    className={activeTab === tab ? "active" : ""}
                    onClick={() => setActiveTab(tab)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </motion.button>
                )
              )}
            </nav>

            <div className="search-container">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />

              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    className="search-results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    {searchResults.map((movie) => (
                      <motion.div
                        key={movie.id}
                        className="search-result-item"
                        whileHover={{ x: 5 }}
                      >
                        <img
                          src={
                            movie.poster_path
                              ? `${IMAGE_BASE}${movie.poster_path}`
                              : "/placeholder-movie.jpg"
                          }
                          alt={movie.title}
                        />
                        <div className="search-result-info">
                          <h4>{movie.title}</h4>
                          <span>
                            {new Date(movie.release_date).getFullYear()}
                          </span>
                          <div className="rating">
                            <i className="fas fa-star"></i>
                            {movie.vote_average.toFixed(1)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Hero Section */}
      <AnimatePresence mode="wait">
        {activeTab === "home" && featured && (
          <motion.section
            key="hero"
            className="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="hero-background"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%), url(${IMAGE_BASE}${featured.backdrop_path})`,
              }}
            >
              <div className="container">
                <div className="hero-content">
                  <motion.h1
                    className="hero-title"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {featured.title}
                  </motion.h1>
                  <motion.p
                    className="hero-description"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {featured.overview}
                  </motion.p>
                  <motion.div
                    className="hero-meta"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <span className="rating">
                      <i className="fas fa-star"></i>
                      {featured.vote_average.toFixed(1)}
                    </span>
                    <span className="year">
                      {new Date(featured.release_date).getFullYear()}
                    </span>
                    <span className="duration">
                      <i className="fas fa-clock"></i>
                      {Math.floor(featured.runtime / 60)}h{" "}
                      {featured.runtime % 60}m
                    </span>
                  </motion.div>
                  <motion.div
                    className="hero-buttons"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <motion.button
                      className="btn btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-play"></i>
                      Watch Now
                    </motion.button>
                    <motion.button
                      className="btn btn-secondary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-plus"></i>
                      My List
                    </motion.button>
                    <motion.button
                      className="btn btn-outline"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-info"></i>
                      Details
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <MovieSection title="🔥 Trending Now" movies={trending} />
                <MovieSection title="🎬 Popular Movies" movies={movies} />
                <MovieSection title="🐉 Anime Collection" movies={anime} />
                <MovieSection title="🚀 Coming Soon" movies={upcoming} />
              </motion.div>
            )}

            {activeTab === "movies" && (
              <motion.div
                key="movies"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <MovieSection
                  title="All Movies"
                  movies={movies}
                  showAll={true}
                />
              </motion.div>
            )}

            {activeTab === "anime" && (
              <motion.div
                key="anime"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <MovieSection
                  title="Anime Collection"
                  movies={anime}
                  showAll={true}
                />
              </motion.div>
            )}

            {activeTab === "trending" && (
              <motion.div
                key="trending"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <MovieSection
                  title="Trending Movies"
                  movies={trending}
                  showAll={true}
                />
              </motion.div>
            )}

            {activeTab === "upcoming" && (
              <motion.div
                key="upcoming"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <MovieSection
                  title="Upcoming Movies"
                  movies={upcoming}
                  showAll={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <motion.div className="logo" whileHover={{ scale: 1.05 }}>
                <i className="fas fa-film"></i>
                <span>CineVerse</span>
              </motion.div>
              <p>
                Experience cinema like never before. Unlimited movies, anime,
                and TV shows in stunning quality.
              </p>
              <div className="social-links">
                {["facebook", "twitter", "instagram", "youtube"].map(
                  (social) => (
                    <motion.a
                      key={social}
                      href="#"
                      whileHover={{ scale: 1.2, y: -2 }}
                      className={`social-${social}`}
                    >
                      <i className={`fab fa-${social}`}></i>
                    </motion.a>
                  )
                )}
              </div>
            </div>

            <div className="footer-links-grid">
              <div className="footer-column">
                <h4>Explore</h4>
                <a href="#">Movies</a>
                <a href="#">TV Shows</a>
                <a href="#">Anime</a>
                <a href="#">New Releases</a>
              </div>
              <div className="footer-column">
                <h4>Account</h4>
                <a href="#">Profile</a>
                <a href="#">My List</a>
                <a href="#">Settings</a>
                <a href="#">Help Center</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Careers</a>
                <a href="#">Press</a>
                <a href="#">Contact</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 CineVerse. Made with ❤️ for movie lovers.</p>
            <div className="legal-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Enhanced Movie Section Component
const MovieSection = ({ title, movies, showAll = false }) => {
  const scrollRef = useRef(null);
  const displayMovies = showAll ? movies : movies.slice(0, 10);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollLeft += direction * scrollAmount;
    }
  };

  return (
    <motion.section
      className="movie-section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {!showAll && (
          <motion.button className="see-all" whileHover={{ x: 5 }}>
            See All <i className="fas fa-arrow-right"></i>
          </motion.button>
        )}
      </div>

      {showAll ? (
        <div className="movies-grid">
          {displayMovies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      ) : (
        <div className="carousel-container">
          <motion.button
            className="carousel-btn prev"
            onClick={() => scroll(-1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="fas fa-chevron-left"></i>
          </motion.button>

          <div className="carousel" ref={scrollRef}>
            {displayMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>

          <motion.button
            className="carousel-btn next"
            onClick={() => scroll(1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="fas fa-chevron-right"></i>
          </motion.button>
        </div>
      )}
    </motion.section>
  );
};

// Enhanced Movie Card Component
const MovieCard = ({ movie, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <div className="card-image">
        <img
          src={
            movie.poster_path
              ? `${IMAGE_BASE}${movie.poster_path}`
              : "/placeholder-movie.jpg"
          }
          alt={movie.title}
        />

        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="card-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                className="play-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fas fa-play"></i>
              </motion.button>

              <div className="card-actions">
                {["plus", "heart", "bookmark"].map((action, i) => (
                  <motion.button
                    key={action}
                    className="action-btn"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <i className={`fas fa-${action}`}></i>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="card-badge">
          <i className="fas fa-star"></i>
          {movie.vote_average.toFixed(1)}
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{movie.title}</h3>
        <div className="card-meta">
          <span className="year">
            {new Date(movie.release_date).getFullYear()}
          </span>
          <span className="genre">Movie</span>
        </div>
      </div>
    </motion.div>
  );
};

export default App;
