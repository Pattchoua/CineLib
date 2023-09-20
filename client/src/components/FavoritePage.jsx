import { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSectionFP from './HeroSectionFP';
import { MdDelete, MdComment } from 'react-icons/md';
import { FaComment } from 'react-icons/fa';
import CommentModal from './CommentModal';
import CommentsForSelectedMovie from './CommentsForSelectedMovie';

const FavoritePage = () => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentsForSelectedMovie, setCommentsForSelectedMovie] = useState([]);
  const [isViewCommentsModalOpen, setIsViewCommentsModalOpen] = useState(false);
  

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/favorites`
        );
        console.log(response.data);
        setFavoriteMovies(response.data);
      } catch (error) {
        console.error('Error fetching favorite movies:', error.message);
      }
    };

    fetchFavoriteMovies();
  }, []);

  const handleRemoveFromFavorites = async (movieId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/favorites/${movieId}`
      );
      console.log('Removed from favorites:', response.data);
      // After removal, update the favoriteMovies state to reflect the changes
      setFavoriteMovies((prevFavorites) =>
        prevFavorites.filter((movie) => movie.id !== movieId)
      );
    } catch (error) {
      console.error('Error removing from favorites:', error.message);
    }
  };

  const handleOpenCommentModal = (movieId) => {
    setSelectedMovieId(movieId);
    setIsCommentModalOpen(true);
  };

  const handleCloseCommentModal = () => {
    setSelectedMovieId(null);
    setIsCommentModalOpen(false);
  };

  const handleSaveComment = (comment) => {
    // Update the comment for the selected movie in the state
    setFavoriteMovies((prevFavorites) =>
      prevFavorites.map((movie) =>
        movie.id === selectedMovieId
          ? { ...movie, comment: comment.text }
          : movie
      )
    );
  };

  const handleViewComments = async (movieId) => {
    try {
      // Make a GET request to fetch comments for the selected movie
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/favorites/${movieId}/comments`
      );
      console.log('Fetched comments for selected movie:', response.data);

      // Store the comments in a state variable
      setCommentsForSelectedMovie(response.data);

      // Open the "View Comments" modal
      setIsViewCommentsModalOpen(true);
    } catch (error) {
      console.error('Error fetching comments for selected movie:', error.message);
    }
  };

  const handleCloseViewCommentsModal = () => {
    setIsViewCommentsModalOpen(false);
  };

  return (
    <div>
      <HeroSectionFP />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h2 className='text-3xl font-semibold text-center text-gray-800 mb-8'>
          Favorite Movies
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {favoriteMovies.length === 0 ? (
            <p className='text-black font-bold text-xl text-center'>
              No favorite movies yet!
            </p>
          ) : (
            favoriteMovies.map((movie) => (
              <div
                key={movie.id}
                className='bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 duration-300 hover:shadow-xl'
              >
                {/* Movie Image */}
                <img
                  src={movie.poster_path} // Assuming `poster_path` contains the image URL
                  alt={movie.title}
                  className='w-full h-48 object-cover transition-transform hover:scale-110 duration-300'
                />

                <div className='p-4'>
                  {/* Movie Title */}
                  <h3 className='text-xl font-semibold text-orange-600 hover:text-orange-800 transition-colors duration-300'>
                    {movie.title}
                  </h3>

                  {/* Button Container */}
                  <div className='flex justify-between mt-2'>
                    {/* Remove from Favorites Button */}
                    <button
                      onClick={() => handleRemoveFromFavorites(movie.id)}
                      className='text-blue-200 hover:text-red-600 font-bold py-2 px-4 rounded'
                    >
                      <MdDelete size={25} /> Delete
                    </button>

                    {/* Comment Button */}
                    <button
                      className='text-blue-200 hover:text-fuchsia-400 font-bold py-2 px-4 rounded'
                      onClick={() => handleOpenCommentModal(movie.id)}
                    >
                      <FaComment size={25} /> Edit
                    </button>

                    {/* View Comments Button */}
                    <button
                      className='text-blue-200 hover:text-fuchsia-400 font-bold py-2 px-4 rounded'
                      onClick={() => handleViewComments(movie.id)}
                    >
                      <MdComment size={25} /> View
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Comment Modal */}
      {isCommentModalOpen && (
        <CommentModal
          movieId={selectedMovieId}
          onClose={handleCloseCommentModal}
          onSave={handleSaveComment}
        />
      )}

      {/* View Comments Modal */}
      {isViewCommentsModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div className='bg-white p-6 w-96 rounded-lg shadow-xl'>
            <h2 className='text-2xl font-semibold mb-4'>Comments</h2>
            <CommentsForSelectedMovie comments={commentsForSelectedMovie} />
            <button
              className='text-blue-500 hover:underline mt-4 cursor-pointer'
              onClick={handleCloseViewCommentsModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
