import axios from 'axios';
import { useState, useEffect } from 'react';
import HeroSectionMP from './HeroSectionMP';
import { Link } from 'react-router-dom';

const MoviesPage = () => {
  const [movies, setMovies] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 12; 

  // Fetching the Movies from the Backend
  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/api/movies`);
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching Movies', error);
    }
  };

  // Fetching the Movies when the component is mounted
  useEffect(() => {
    fetchMovies();
  }, []);

  // Handle next page click
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  // Handle previous page click
  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  // Calculate which movies to display on the current page
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies?.slice(indexOfFirstMovie, indexOfLastMovie);

  return (
    <div>
      <HeroSectionMP />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentMovies &&
            currentMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 duration-300 hover:shadow-xl"
              >
                <Link to={`/movies/${movie.id}`}>
                  <img
                    src={movie.poster_path} // Assuming `poster_path` contains the image URL
                    alt={movie.title}
                    className="w-full h-48 object-cover transition-transform hover:scale-110 duration-300"
                  />
                </Link>
                <div className="p-4">
                  <Link
                    to={`/movies/${movie.id}`}
                    className="text-xl font-semibold text-orange-600 hover:text-orange-800 transition-colors duration-300"
                  >
                    {movie.title}
                  </Link>
                  <p className="text-sm text-gray-600">
                    Released:{' '}
                    {new Date(movie.release_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Previous Page
          </button>
          <button
            onClick={handleNextPage}
            disabled={indexOfLastMovie >= movies?.length}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;
