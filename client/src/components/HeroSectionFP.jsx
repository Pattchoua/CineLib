import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'


const HeroSectionFP = () => {
    const [heroImage, setHeroImage] = useState('');

    const fetchTrendingMovies = async () => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${import.meta.env.VITE_TMDB_API_KEY}`);
    
      // Set the hero image URL to the backdrop path of the first trending movie
        if (response.data.results.length > 0) {
        setHeroImage(`https://image.tmdb.org/t/p/original${response.data.results[11].backdrop_path}`);
        }
        } catch (error) {
            console.error('Error fetching trending movies:', error);
        }
    };

    useEffect(() => {
    fetchTrendingMovies();
    }, []);

    const navigate = useNavigate()

    const handleGoBack = () => {
        navigate('/movies');
    }

    return (

        <div className='w-full mx-auto p-4'>
        <div className='bg-cover rounded-md bg-center h-[350px] relative p-4'  style={{ backgroundImage: `url(${heroImage})` }}>
            <div className= 'absolute top-0 right-2 bottom-0 left-0 text-gray-200 w-full h-full bg-black/40 max-h-[700px] flex flex-col justify-center'>
                <h1 className='px-4 text-4xl sm:text-3xl md:text-4xl lg:text-5xl font-bold'> Your Top Movies Are Here</h1>
                <h3 className='px-4 text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-bold'>Explore  <span className='text-cyan-400'>Your Best</span>Picks</h3> 
                <div className='flex justify-left p-4'>
                    <button onClick ={handleGoBack} className='bg-blue-500 text-white px-4 py-2 mt-4 rounded-md'>Go Back</button>
                </div>    
            </div>
        </div>
</div>
);
};

export default HeroSectionFP;