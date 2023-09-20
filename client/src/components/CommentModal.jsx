import { useState } from 'react';
import axios from 'axios';

const CommentModal = ({ movieId, onClose, onSave }) => {
    const [commentText, setCommentText] = useState('');

    const handleSaveComment = async () => {
    try {
        const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/favorites/${movieId}/comments`,
        { text: commentText }
        );
        console.log('Comment added:', response.data);
        onSave(response.data); 
        setCommentText('');
        onClose();
    } catch (error) {
        console.error('Error adding comment:', error.message);

    }
};

    return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
        <div className='absolute inset-0 bg-black opacity-50'></div>
        <div className='relative bg-white p-8 rounded-lg shadow-lg'>
        <h2 className='text-xl font-semibold mb-4'>Add Comment</h2>
        <textarea
            className='w-full h-32 p-2 border border-gray-300 rounded'
            placeholder='Enter your comment...'
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
        >

        </textarea>
        <div className='mt-4 flex justify-end'>
            <button
            className='px-4 py-2 mr-2 text-blue-200 hover:text-fuchsia-400 font-bold rounded'
            onClick={handleSaveComment}
            >
            Save Comment
            </button>
            <button
            className='px-4 py-2 text-red-600 hover:text-red-800 font-bold rounded'
            onClick={onClose}
            >
            Cancel
            </button>
        </div>
        </div>
    </div>
    );
};

export default CommentModal;
