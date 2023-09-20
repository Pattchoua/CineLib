import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchTrendingMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      );

      // Set the hero images URLs to the backdrop paths of the trending movies
      if (response.data.results.length > 0) {
        const images = response.data.results.map(
          (movie) => `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        );
        setHeroImages(images);
      }
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  };

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  useEffect(() => {
    // Create an interval to change the hero image every 3 seconds
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % heroImages.length
      );
    }, 10000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [heroImages]);

  const navigate = useNavigate();

  const handleGoToMovies = () => {
    navigate('/movies');
  };

  return (
    <div className="mx-4 md:mx-8 lg:mx-12 xl:mx-20 mb-8 md:mb-12 relative rounded-xl min-h-screen overflow-hidden">
      {heroImages.length > 0 && (
        <div
          className="absolute inset-0 w-full h-full transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${heroImages[currentImageIndex]})`,
            opacity: 0.8,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            animation: 'slideImage 20s linear infinite',
          }}
        ></div>
      )}

      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40 text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-4">
          Welcome to CineLib
        </h1>
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white mb-8">
          Explore our <span className="text-cyan-400">vast collection</span> of movies
        </h3>
        <button
          onClick={handleGoToMovies}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition duration-300 ease-in-out transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomePage;
