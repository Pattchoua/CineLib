import axios from "axios";
import { useState, useEffect } from "react";
import HeroSectionMP from "./HeroSectionMP";
import { Link } from "react-router-dom";

const MoviesPage = () => {
  const [movies, setMovies] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 12;

  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/movies`
      );
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching Movies", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(currentPage - 1);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies?.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil((movies?.length || 0) / moviesPerPage);

  return (
    <div>
      <HeroSectionMP />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6">
        {/* Movie List Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {currentMovies &&
            currentMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden group transition-transform transform sm:hover:scale-105"
              >
                <div className="relative aspect-w-3 aspect-h-4">
                  <Link to={`/movies/${movie.id}`} className="absolute inset-0">
                    <img
                      src={movie.poster_path}
                      alt={movie.title}
                      className="object-cover w-full h-full transition-transform sm:group-hover:scale-110 duration-300"
                    />
                  </Link>
                </div>
                <div className="p-2 sm:p-4">
                  <Link
                    to={`/movies/${movie.id}`}
                    className="text-md sm:text-lg font-semibold text-orange-600 hover:text-orange-800 transition-colors duration-300 block mt-1 truncate"
                  >
                    {movie.title}
                  </Link>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(movie.release_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            &laquo;
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const pageNumber = idx + 1;
            if (
              pageNumber === currentPage ||
              pageNumber === 1 ||
              pageNumber === totalPages ||
              Math.abs(currentPage - pageNumber) <= 1
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-8 h-8 ${
                    pageNumber === currentPage
                      ? "bg-blue-700 text-white"
                      : "bg-white text-blue-700 border border-blue-700"
                  } rounded-full hover:bg-blue-500 hover:text-white transition`}
                >
                  {pageNumber}
                </button>
              );
            }

            if (
              pageNumber === currentPage - 2 ||
              pageNumber === currentPage + 2
            ) {
              return (
                <span key={pageNumber} className="px-2">
                  ...
                </span>
              );
            }

            return null;
          })}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;
