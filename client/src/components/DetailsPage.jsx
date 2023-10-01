import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdFavorite } from "react-icons/md";

const DetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAlreadyInFavorites, setIsAlreadyInFavorites] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/movies/${id}`
        );
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching Movie", error);
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
        const isAlreadyFavorite = favoriteMovies.some(
          (fav) => fav.movie_id === id
        );
        setIsAlreadyInFavorites(isAlreadyFavorite);
      } catch (error) {
        console.error("Error checking if movie is in favorites", error);
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

      if (response.status === 201) {
        setIsFavorite(true);
        setIsAlreadyInFavorites(true);
        navigate("/favorites");
      } else if (response.status === 200) {
        // Movie is already in favorites
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error adding to favorites", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="relative">
      {movie && (
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `url(${movie.poster_path}) no-repeat center center fixed`,
            backgroundSize: "cover",
            filter: "brightness(20%)",
          }}
        ></div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center relative z-10">
        <div className="p-4 my-4 flex flex-col justify-center items-center rounded-lg bg-black/35 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-1/3">
          {movie && (
            <div className="flex flex-col items-center space-y-4">
              <h2 className="text-orange-600 font-bold text-xl md:text-2xl lg:text-3xl text-center">
                {movie.title} <br />
                <span className="text-cyan-300 text-lg md:text-xl lg:text-2xl">
                  {new Date(movie.release_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </h2>

              <img
                src={movie.poster_path}
                alt={movie.title}
                className="max-w-full h-[350px] mt-4"
              />
              <p className="text-base md:text-lg text-black text-center">
                <span className="text-italic text-orange-500 font-bold text-lg md:text-xl lg:text-2xl">
                  Overview
                </span>{" "}
                <br />
                <span className="font-semibold text-gray-300">
                  {movie.overview}
                </span>
              </p>
              <div className="flex items-center justify-center space-x-4">
                {isAlreadyInFavorites ? (
                  <button className="text-blue-200 cursor-not-allowed" disabled>
                    <MdFavorite size={25} />
                    Movie Added to Watchlist
                  </button>
                ) : (
                  <button
                    onClick={addToFavorites}
                    disabled={isFavorite}
                    className={`${
                      isFavorite
                        ? "bg-blue-200 text-fuchsia-400 cursor-not-allowed"
                        : "text-blue-200 hover:text-fuchsia-400"
                    } flex items-center font-bold py-2 px-2 rounded-lg bg-blue-500 transition duration-300 transform hover:scale-105`}
                  >
                    <MdFavorite size={25} />
                    {isFavorite ? "Added to Watchlist" : "Add to Watchlist"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-bg fixed inset-0 bg-gray-900 opacity-50"></div>
          <div className="modal mx-auto p-4 bg-white rounded shadow-lg z-10">
            <p className="text-center text-xl font-bold mb-4">
              This movie is already in your Watchlist!
            </p>
            <button
              onClick={closeModal}
              className="block mx-auto bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPage;
