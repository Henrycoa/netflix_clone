// src/App.js - Complete Netflix Clone with Footer & Movie API
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// TMDB API Integration
const TMDB_API = {
  apiKey: "d61a88778a1e882c37f0ba520bbbc191", // Get free API key from https://www.themoviedb.org/settings/api
  baseUrl: "https://api.themoviedb.org/3",
  imageBase: "https://image.tmdb.org/t/p/w500",

  // Fallback data in case API fails
  fallbackMovies: [
    {
      id: 1,
      title: "The Irishman",
      overview:
        "Hitman Frank Sheeran looks back at the secrets he kept as a loyal member of the Bufalino crime family.",
      poster_path: "/mbYQLLluS651W89jO7MOZcL7UWH.jpg",
      backdrop_path: "/d1sVANghKKMZNvqjW0V6y1ejvV9.jpg",
      release_date: "2019-11-01",
      vote_average: 7.8,
      runtime: 209,
      genre_ids: [80, 18],
      media_type: "movie",
    },
    {
      id: 2,
      title: "Extraction",
      overview:
        "A black-market mercenary who has nothing to lose is hired to rescue the kidnapped son of an imprisoned international crime lord.",
      poster_path: "/1X4h40fcB4WWUmIBK0auT4zRBAV.jpg",
      backdrop_path: "/1R6cvRtZgsYCkh8UFuWFN33xBP4.jpg",
      release_date: "2020-04-24",
      vote_average: 6.7,
      runtime: 116,
      genre_ids: [28, 53],
      media_type: "movie",
    },
  ],

  async getTrendingMovies() {
    try {
      const response = await fetch(
        `${this.baseUrl}/trending/movie/week?api_key=${this.apiKey}`
      );
      const data = await response.json();
      return data.results || this.fallbackMovies;
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      return this.fallbackMovies;
    }
  },

  async getPopularMovies() {
    try {
      const response = await fetch(
        `${this.baseUrl}/movie/popular?api_key=${this.apiKey}`
      );
      const data = await response.json();
      return data.results || this.fallbackMovies;
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      return this.fallbackMovies;
    }
  },

  async getTopRatedMovies() {
    try {
      const response = await fetch(
        `${this.baseUrl}/movie/top_rated?api_key=${this.apiKey}`
      );
      const data = await response.json();
      return data.results || this.fallbackMovies;
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
      return this.fallbackMovies;
    }
  },

  async getMovieDetails(movieId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&append_to_response=credits`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  },

  async searchMovies(query) {
    try {
      const response = await fetch(
        `${this.baseUrl}/search/movie?api_key=${
          this.apiKey
        }&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error searching movies:", error);
      return [];
    }
  },
};

// Content Service with TMDB Integration
const contentAPI = {
  // Movies from TMDB
  async getFeaturedMovies() {
    const movies = await TMDB_API.getTrendingMovies();
    return movies.slice(0, 5).map(movie => ({
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      image: `${TMDB_API.imageBase}/w500${movie.poster_path}`,
      banner: `${TMDB_API.imageBase}/w1280${movie.backdrop_path}`,
      year: new Date(movie.release_date).getFullYear(),
      rating: movie.vote_average.toFixed(1),
      duration: `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`,
      genre: this.getGenreNames(movie.genre_ids),
      type: "movie"
    }));
  },

  async getTrendingMovies() {
    const movies = await TMDB_API.getTrendingMovies();
    return movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      image: `${TMDB_API.imageBase}/w500${movie.poster_path}`,
      year: new Date(movie.release_date).getFullYear(),
      rating: movie.vote_average.toFixed(1),
      type: "movie"
    }));
  },

  async getPopularMovies() {
    const movies = await TMDB_API.getPopularMovies();
    return movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      image: `${TMDB_API.imageBase}/w500${movie.poster_path}`,
      year: new Date(movie.release_date).getFullYear(),
      rating: movie.vote_average.toFixed(1),
      type: "movie"
    }));
  },

  // Anime Data (Fallback)
  getTrendingAnime() {
    return [
      {
        id: 7,
        title: "Attack on Titan",
        description: "After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans.",
        image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500",
        banner: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1200",
        year: 2013,
        rating: 9.0,
        episodes: 75,
        type: "anime",
        genre: ["Action", "Drama", "Fantasy"]
      },
      {
        id: 8,
        title: "Demon Slayer",
        description: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly.",
        image: "https://images.unsplash.com/photo-1578632749014-ca77efd052eb?w=500",
        banner: "https://images.unsplash.com/photo-1578632749014-ca77efd052eb?w=1200",
        year: 2019,
        rating: 8.7,
        episodes: 44,
        type: "anime",
        genre: ["Action", "Fantasy"]
      }
    ];
  },

  // TV Shows Data
  getPopularTVShows() {
    return [
      {
        id: 9,
        title: "Stranger Things",
        description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
        image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500",
        banner: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1200",
        year: 2016,
        rating: 8.7,
        seasons: 4,
        type: "tv"
      },
      {
        id: 10,
        title: "The Crown",
        description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
        image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500",
        banner: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1200",
        year: 2016,
        rating: 8.6,
        seasons: 5,
        type: "tv"
      }
    ];
  },

  // Helper function for genres
  getGenreNames(genreIds) {
    const genres = {
      28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
      80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
      14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
      9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
      10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
    };
    return genreIds.map(id => genres[id] || "Unknown");
  },

  // Search function
  async searchContent(query) {
    const [movies, anime, tvShows] = await Promise.all([
      TMDB_API.searchMovies(query),
      Promise.resolve(this.getTrendingAnime().filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
      )),
      Promise.resolve(this.getPopularTVShows().filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
      ))
    ]);

    const movieResults = movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      image: `${TMDB_API.imageBase}/w500${movie.poster_path}`,
      year: new Date(movie.release_date).getFullYear(),
      rating: movie.vote_average.toFixed(1),
      type: "movie"
    }));

    return [...movieResults, ...anime, ...tvShows];
  }
};

// Netflix Footer Component
const NetflixFooter = () => {
  return (
    <footer className="netflix-footer">
      <div className="footer-content">
        <div className="footer-social">
          <a href="#" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" aria-label="YouTube">
            <i className="fab fa-youtube"></i>
          </a>
        </div>

        <div className="footer-links">
          <div className="links-column">
            <a href="#">Audio Description</a>
            <a href="#">Investor Relations</a>
            <a href="#">Legal Notices</a>
          </div>
          <div className="links-column">
            <a href="#">Help Center</a>
            <a href="#">Jobs</a>
            <a href="#">Cookie Preferences</a>
          </div>
          <div className="links-column">
            <a href="#">Gift Cards</a>
            <a href="#">Terms of Use</a>
            <a href="#">Corporate Information</a>
          </div>
          <div className="links-column">
            <a href="#">Media Center</a>
            <a href="#">Privacy</a>
            <a href="#">Contact Us</a>
          </div>
        </div>

        <div className="footer-service">
          <button className="service-code">
            <i className="fas fa-code"></i>
            Service Code
          </button>
        </div>

        <div className="footer-copyright">
          <p>&copy; 1997-2024 Netflix, Inc.</p>
          <p>This is a clone project for educational purposes.</p>
        </div>
      </div>
    </footer>
  );
};

// Onboarding Components (Same as before)
const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profiles, setProfiles] = useState([]);
  const [newProfileName, setNewProfileName] = useState('');

  const steps = [
    {
      title: "Welcome to Netflix",
      subtitle: "See what's next.",
      description: "Unlimited movies, TV shows, and more.",
      image: "🎬"
    },
    {
      title: "Watch anywhere",
      subtitle: "Stream on your phone, tablet, laptop, and TV.",
      description: "Enjoy on all your devices.",
      image: "📱"
    },
    {
      title: "Create profiles for kids",
      subtitle: "Send kids on adventures with their favorite characters.",
      description: "In a space made just for them—free with your membership.",
      image: "👶"
    }
  ];

  const addProfile = () => {
    if (newProfileName.trim() && profiles.length < 5) {
      setProfiles([...profiles, {
        id: profiles.length + 1,
        name: newProfileName,
        avatar: `https://i.pravatar.cc/150?img=${profiles.length + 1}`,
        isKid: false
      }]);
      setNewProfileName('');
    }
  };

  const removeProfile = (id) => {
    setProfiles(profiles.filter(p => p.id !== id));
  };

  const completeOnboarding = () => {
    localStorage.setItem('netflix-onboarding-complete', 'true');
    localStorage.setItem('netflix-profiles', JSON.stringify(profiles));
    onComplete();
  };

  return (
    <div className="onboarding">
      {step <= 3 ? (
        <div className="onboarding-step">
          <div className="onboarding-header">
            <div className="logo">NETFLIX</div>
            {step > 1 && (
              <button className="skip-btn" onClick={completeOnboarding}>
                Skip
              </button>
            )}
          </div>
          
          <div className="onboarding-content">
            <div className="step-image">{steps[step-1].image}</div>
            <h1>{steps[step-1].title}</h1>
            <h2>{steps[step-1].subtitle}</h2>
            <p>{steps[step-1].description}</p>
            
            <div className="step-indicators">
              {steps.map((_, index) => (
                <div 
                  key={index} 
                  className={`indicator ${step === index + 1 ? 'active' : ''}`}
                ></div>
              ))}
            </div>
            
            <button 
              className="next-btn"
              onClick={() => step < 3 ? setStep(step + 1) : completeOnboarding()}
            >
              {step < 3 ? 'Next' : 'Get Started'}
            </button>
          </div>
        </div>
      ) : (
        <div className="profiles-setup">
          <div className="profiles-header">
            <div className="logo">NETFLIX</div>
          </div>
          
          <div className="profiles-content">
            <h1>Who's watching?</h1>
            
            <div className="profiles-grid">
              {profiles.map(profile => (
                <div key={profile.id} className="profile-card">
                  <div className="profile-avatar">
                    <img src={profile.avatar} alt={profile.name} />
                    {profile.isKid && <div className="kid-badge">Kids</div>}
                  </div>
                  <span className="profile-name">{profile.name}</span>
                  <button 
                    className="remove-profile"
                    onClick={() => removeProfile(profile.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {profiles.length < 5 && (
                <div className="add-profile-card" onClick={addProfile}>
                  <div className="add-profile-icon">+</div>
                  <span>Add Profile</span>
                </div>
              )}
            </div>

            {profiles.length === 0 && (
              <div className="profile-form">
                <input
                  type="text"
                  placeholder="Enter profile name"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addProfile()}
                />
                <button onClick={addProfile}>Create Profile</button>
              </div>
            )}

            {profiles.length > 0 && (
              <button className="continue-btn" onClick={completeOnboarding}>
                Continue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Netflix Header (Same as before)
const NetflixHeader = ({ currentProfile, onProfileChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const profiles = JSON.parse(localStorage.getItem('netflix-profiles') || '[]');

  return (
    <header className={`netflix-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <div className="header-left">
          <div className="logo" onClick={() => navigate('/')}>
            NETFLIX
          </div>
          <nav className="main-nav">
            <button 
              className={location.pathname === '/' ? 'active' : ''}
              onClick={() => navigate('/')}
            >
              Home
            </button>
            <button 
              className={location.pathname === '/movies' ? 'active' : ''}
              onClick={() => navigate('/movies')}
            >
              Movies
            </button>
            <button 
              className={location.pathname === '/tv' ? 'active' : ''}
              onClick={() => navigate('/tv')}
            >
              TV Shows
            </button>
            <button 
              className={location.pathname === '/anime' ? 'active' : ''}
              onClick={() => navigate('/anime')}
            >
              Anime
            </button>
            <button 
              className={location.pathname === '/mylist' ? 'active' : ''}
              onClick={() => navigate('/mylist')}
            >
              My List
            </button>
          </nav>
        </div>
        
        <div className="header-right">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search titles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
            />
          </div>
          
          <div className="profile-menu">
            <div 
              className="profile-avatar"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <img src={currentProfile?.avatar || 'https://i.pravatar.cc/150?img=1'} alt="Profile" />
            </div>
            
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-content">
                  <h3>Who's watching?</h3>
                  <div className="profile-options">
                    {profiles.map(profile => (
                      <div
                        key={profile.id}
                        className="profile-option"
                        onClick={() => {
                          onProfileChange(profile);
                          setShowProfileMenu(false);
                        }}
                      >
                        <img src={profile.avatar} alt={profile.name} />
                        <span>{profile.name}</span>
                      </div>
                    ))}
                  </div>
                  <button className="manage-profiles">Manage Profiles</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Hero Banner (Same as before with fixes)
const HeroBanner = ({ featuredContent = [] }) => {
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    if (featuredContent.length > 0) {
      const timer = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % featuredContent.length);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [featuredContent.length]);

  if (!featuredContent || featuredContent.length === 0) {
    return (
      <div className="hero-banner loading">
        <div className="banner-background">
          <div className="banner-content">
            <div className="loading-spinner"></div>
            <p>Loading featured content...</p>
          </div>
        </div>
      </div>
    );
  }

  const featured = featuredContent[currentFeature];

  return (
    <div className="hero-banner">
      <div 
        className="banner-background"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%), url(${featured.banner})`
        }}
      >
        <div className="banner-content">
          <h1 className="banner-title">{featured.title}</h1>
          <div className="banner-meta">
            <span className="rating">
              <i className="fas fa-star"></i>
              {featured.rating}
            </span>
            <span className="year">{featured.year}</span>
            {featured.duration && <span className="duration">{featured.duration}</span>}
            {featured.episodes && <span className="episodes">{featured.episodes} episodes</span>}
            {featured.seasons && <span className="seasons">{featured.seasons} seasons</span>}
          </div>
          <p className="banner-description">{featured.description}</p>
          <div className="banner-buttons">
            <button className="play-button">
              <i className="fas fa-play"></i>
              Play
            </button>
            <button className="info-button">
              <i className="fas fa-info-circle"></i>
              More Info
            </button>
          </div>

          {featured.cast && (
            <div className="featured-cast">
              <strong>Starring:</strong> {featured.cast.join(', ')}
            </div>
          )}
        </div>
      </div>
      
      {featuredContent.length > 1 && (
        <div className="banner-indicators">
          {featuredContent.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentFeature ? 'active' : ''}`}
              onClick={() => setCurrentFeature(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Content Row Component (Same as before)
const ContentRow = ({ title, items = [], type = 'mixed' }) => {
  const rowRef = React.useRef();

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = 300;
      rowRef.current.scrollLeft += direction * scrollAmount;
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="content-row">
        <h2 className="row-title">{title}</h2>
        <div className="row-loading">
          <p>Loading {title.toLowerCase()}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-container">
        <button className="row-arrow left" onClick={() => scroll(-1)}>
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <div className="row-content" ref={rowRef}>
          {items.map(item => (
            <div key={item.id} className="row-item">
              <img 
                src={item.image} 
                alt={item.title}
                className="item-poster"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450/333333/666666?text=No+Image';
                }}
              />
              <div className="item-overlay">
                <h3>{item.title}</h3>
                <div className="item-meta">
                  <span className="rating">
                    <i className="fas fa-star"></i>
                    {item.rating}
                  </span>
                  {item.duration && <span className="duration">{item.duration}</span>}
                  {item.episodes && <span className="episodes">{item.episodes} eps</span>}
                </div>
                <div className="item-actions">
                  <button className="play-btn-small">
                    <i className="fas fa-play"></i>
                  </button>
                  <button className="like-btn">
                    <i className="fas fa-thumbs-up"></i>
                  </button>
                  <button className="add-btn">
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="row-arrow right" onClick={() => scroll(1)}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

// Netflix Home Page
const NetflixHome = () => {
  const [featuredContent, setFeaturedContent] = useState([]);
  const [trendingNow, setTrendingNow] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [animeList, setAnimeList] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [
          featured,
          trending,
          popular,
          topRatedMovies,
          anime,
          tv
        ] = await Promise.all([
          contentAPI.getFeaturedMovies(),
          contentAPI.getTrendingMovies(),
          contentAPI.getPopularMovies(),
          contentAPI.getPopularMovies(), // Using same for demo
          Promise.resolve(contentAPI.getTrendingAnime()),
          Promise.resolve(contentAPI.getPopularTVShows())
        ]);

        setFeaturedContent(featured);
        setTrendingNow(trending);
        setPopularMovies(popular);
        setTopRated(topRatedMovies.slice(0, 10));
        setAnimeList(anime);
        setTvShows(tv);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="netflix-home loading">
        <div className="loading-screen">
          <div className="loading-spinner-large"></div>
          <p>Loading Netflix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="netflix-home">
      <HeroBanner featuredContent={featuredContent} />
      
      <div className="content-rows">
        <ContentRow title="Trending Now" items={trendingNow} />
        <ContentRow title="Popular on Netflix" items={popularMovies} />
        <ContentRow title="Top Rated" items={topRated} />
        <ContentRow title="TV Shows" items={tvShows} />
        <ContentRow title="Anime Series" items={animeList} />
        <ContentRow title="Watch Again" items={trendingNow.slice(0, 8)} />
      </div>
    </div>
  );
};

// Movies Page
const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      const movies = await contentAPI.getPopularMovies();
      setMovies(movies);
      setLoading(false);
    };

    loadMovies();
  }, []);

  if (loading) {
    return (
      <div className="browse-page loading">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-page movies-page">
      <div className="page-header">
        <h1>Movies</h1>
        <div className="page-filters">
          <select>
            <option>Genres</option>
            <option>Action</option>
            <option>Comedy</option>
            <option>Drama</option>
            <option>Horror</option>
          </select>
          <select>
            <option>Sort By</option>
            <option>Popularity</option>
            <option>Release Date</option>
            <option>Rating</option>
          </select>
        </div>
      </div>

      <div className="browse-grid">
        {movies.map(movie => (
          <div key={movie.id} className="content-card">
            <img 
              src={movie.image} 
              alt={movie.title}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x450/333333/666666?text=No+Image';
              }}
            />
            <div className="card-content">
              <h3>{movie.title}</h3>
              <div className="card-meta">
                <span className="rating">{movie.rating}</span>
                <span className="year">{movie.year}</span>
              </div>
              <p>{movie.description}</p>
              <div className="card-actions">
                <button className="play-btn">
                  <i className="fas fa-play"></i> Play
                </button>
                <button className="add-btn">
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// TV Shows Page
const TVShowsPage = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShows(contentAPI.getPopularTVShows());
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="browse-page loading">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading TV shows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-page tv-page">
      <div className="page-header">
        <h1>TV Shows</h1>
      </div>
      <div className="browse-grid">
        {shows.map(show => (
          <div key={show.id} className="content-card">
            <img 
              src={show.image} 
              alt={show.title}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x450/333333/666666?text=No+Image';
              }}
            />
            <div className="card-content">
              <h3>{show.title}</h3>
              <div className="card-meta">
                <span className="rating">{show.rating}</span>
                <span className="year">{show.year}</span>
                <span className="seasons">{show.seasons} seasons</span>
              </div>
              <p>{show.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Search Page
const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [location]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    const results = await contentAPI.searchContent(searchQuery);
    setSearchResults(results);
    setLoading(false);
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search Results {query && `for "${query}"`}</h1>
        <p>{loading ? 'Searching...' : `${searchResults.length} results found`}</p>
      </div>
      
      {loading ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Searching...</p>
        </div>
      ) : (
        <div className="search-results">
          {searchResults.map(item => (
            <div key={item.id} className="search-result-card">
              <img 
                src={item.image} 
                alt={item.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450/333333/666666?text=No+Image';
                }}
              />
              <div className="result-info">
                <h3>{item.title}</h3>
                <div className="result-meta">
                  <span className="type">{item.type}</span>
                  <span className="year">{item.year}</span>
                  <span className="rating">{item.rating}</span>
                </div>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main App Component
function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(
    localStorage.getItem('netflix-onboarding-complete') === 'true'
  );
  const [currentProfile, setCurrentProfile] = useState(null);

  useEffect(() => {
    const profiles = JSON.parse(localStorage.getItem('netflix-profiles') || '[]');
    if (profiles.length > 0 && !currentProfile) {
      setCurrentProfile(profiles[0]);
    }
  }, [currentProfile]);

  if (!onboardingComplete) {
    return <Onboarding onComplete={() => setOnboardingComplete(true)} />;
  }

  return (
    <Router>
      <div className="netflix-app">
        <NetflixHeader 
          currentProfile={currentProfile} 
          onProfileChange={setCurrentProfile}
        />
        
        <Routes>
          <Route path="/" element={<NetflixHome />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv" element={<TVShowsPage />} />
          <Route path="/anime" element={<TVShowsPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>

        <NetflixFooter />
      </div>
    </Router>
  );
}

export default App;