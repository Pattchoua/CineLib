import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import HeroSectionMD from './HeroSectionMD';
import { useNavigate } from 'react-router-dom';
import { MdFavorite } from 'react-icons/md';


const DetailsPage = () => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAlreadyInFavorites, setIsAlreadyInFavorites] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/movies/${id}`
        );
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching Movie', error);
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    const checkIfMovieIsInFavorites = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/favorites`
        );
        const favoriteMovies = response.data;
        const isAlreadyFavorite = favoriteMovies.some((fav) => fav.movie_id === id);
        setIsAlreadyInFavorites(isAlreadyFavorite);
      } catch (error) {
        console.error('Error checking if movie is in favorites', error);
      }
    };

    checkIfMovieIsInFavorites();
  }, [id]);

  const addToFavorites = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/favorites`,
        { movieId: id }
      );
      console.log(response.data);
      setIsFavorite(true);
      setIsAlreadyInFavorites(true);
      navigate('/favorites');
    } catch (error) {
      console.error('Error adding to favorites', error);
    }
  };

  return (
    <div>
      <HeroSectionMD />
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center">
        <div className="p-4 my-4 flex flex-col justify-center items-center rounded-lg bg-cyan-800 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-1/3">
          {movie && (
            <div className="flex flex-col items-center space-y-4">
              <h2 className="text-orange-600 font-bold text-xl md:text-2xl lg:text-3xl text-center">
                {movie.title} <br />
                <span className="text-cyan-300 text-lg md:text-xl lg:text-2xl">
                  {new Date(movie.release_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </h2>

              <img
                src={movie.poster_path}
                alt={movie.title}
                className="max-w-full h-[350px] mt-4"
              />
              <p className="text-base md:text-lg text-black text-center">
                <span className="text-italic font-bold text-lg md:text-xl lg:text-2xl">
                  Overview
                </span>{' '}
                <br />
                <span className="font-semibold">{movie.overview}</span>
              </p>
              <div className="flex items-center justify-center space-x-4">
                {isAlreadyInFavorites ? (
                  <button
                    className="text-blue-200 cursor-not-allowed"
                    disabled
                  >
                    <MdFavorite size={25} />
                    Movie Added to Favorites
                  </button>
                ) : (
                  <button
                    onClick={addToFavorites}
                    disabled={isFavorite}
                    className={`${
                      isFavorite
                        ? 'bg-blue-200 text-fuchsia-400 cursor-not-allowed'
                        : 'text-blue-200 hover:text-fuchsia-400'
                    } flex items-center font-bold py-2 px-2 rounded transition duration-300 transform hover:scale-105`}
                  >
                    <MdFavorite size={25} />
                    {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
