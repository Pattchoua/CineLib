import { useState } from 'react';
import axios from 'axios';

const CommentsForSelectedMovie = ({ comments }) => {
    const [commentsList, setCommentsList] = useState(comments);

    const deleteComment = async (movieId, commentId) => {
    try {
        const response = await axios.delete(`/api/movies/${movieId}/comments/${commentId}`);
        setCommentsList(response.data)
    
    } catch (error) {
        console.error('Error deleting comment:', error.message);
      // Handle the error, e.g., show an error message
    }
};

    return (
    <div>
        <ul>
        {commentsList.map((comment) => (
            <li key={comment.id}>
            <strong>User:</strong> {comment.user} <br />
            <strong>Comment:</strong> {comment.text} <br />
            <button onClick={() => deleteComment(comment.id)}>Delete</button>
            </li>
        ))}
        </ul>
    </div>
    );
};

export default CommentsForSelectedMovie;
