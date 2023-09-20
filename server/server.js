const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const axios = require ('axios')

dotenv.config();
const PORT = process.env.PORT || 8080

// PostgreSQL configuration
const pool = new Pool ({
    connectionString: process.env.POSTGRESQL_CONFIGURATION_STRING,
})

// TMDB API configuration
const apiKey = process.env.TMDB_API_KEY;

//Cors and Json Parser
app.use(express.json())
app.use(cors())

// fetching Movies from the database
const fetchMoviesFromTMDB = async () => {
    try {
        
        const response = await axios.get( `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
        if (response.status === 200) {
        return response.data.results; 
        } else {
        throw new Error('Failed to fetch movies from TMDB.');
        }
    } catch (error) {
        throw error;
    }
};

// Add a unique constraint to the 'title' field to prevent duplicates
pool.query('ALTER TABLE movies ADD CONSTRAINT unique_movie_title UNIQUE (title);')
  .then(() => {
    console.log('Unique constraint added to the "title" field.');
  })
  .catch((error) => {
    console.error('Error adding unique constraint:', error.message);
  });


  const insertMovieIntoDatabase = async (movie) => {
    try {
      const {
        title,
        release_date,
        director,
        overview,
        vote_average,
        runtime,
        poster_path,
        original_language,
      } = movie;
  
      // Format release_date as 'YYYY-MM-DD'
      const formattedReleaseDate = `${release_date.substring(0, 4)}-${release_date.substring(5, 7)}-${release_date.substring(8, 10)}`;
  
      // Check if the movie already exists in the database by title
      const checkQuery = 'SELECT * FROM movies WHERE title = $1;';
      const checkResult = await pool.query(checkQuery, [title]);
  
      if (checkResult.rows.length > 0) {
        console.log(`Movie "${title}" already exists in the database. Skipping insertion.`);
        return;
      }
  
      // Define the SQL query to insert the movie into your database
      const query = `
        INSERT INTO movies (
          title,
          release_date,
          director,
          overview,
          vote_average,
          runtime,
          poster_path,
          original_language
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8
        )
        RETURNING *;
      `;
  
      const values = [
        title,
        formattedReleaseDate,
        director,
        overview,
        vote_average,
        runtime,
        `https://image.tmdb.org/t/p/w500${poster_path}`,
        original_language,
      ];
  
      const result = await pool.query(query, values);
  
      if (result.rows.length > 0) {
        console.log(`Movie "${title}" inserted into the database.`);
      } else {
        console.error(`Failed to insert movie "${title}" into the database.`);
      }
    } catch (error) {
      console.error('Error when inserting movie into the database:', error.message);
    }
  };
  
  
  
  // Fetch movies from TMDB and insert them into the postgreSQL database
    fetchMoviesFromTMDB()
    .then((movies) => {
        movies.forEach((movie) => {
        insertMovieIntoDatabase(movie);
        });
    })
    .catch((error) => {
        console.error('Error when fetching movies from TMDB:', error.message);
    });



// route to request all movies fom the PostGresqLdatabase
app.get ('/api/movies', async (req, res) => {
    try {
    const { rows } = await pool.query('SELECT * FROM movies')
        if (rows.length === 0) {
            res.status(404).json({Error:'No Movies Found!'})
        } else {
            res.status(200).json(rows)
        }
    } catch (error) {
        console.error('Error when Sending the query', error)
        res.status(500).json({Error:'Internal Server Error'})
    }
})

// route to request a specific movie based on its ID

app.get('/api/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
    const { rows } = await pool.query('SELECT * FROM movies WHERE id=$1;', [id])
    if (rows.length === 0) {
        res.status(404).json({Error: `Movie with the Id ${id} not found!`})
    } else {
        res.status(200).json(rows[0])
    }
    } catch (error) {
        console.error('Error when Sending the query', error)
        res.status(500).json({Error:'Internal Server Error'})
    }
})

// Route to post a specific movie
app.post('/api/movies', async (req, res) => {
    const {
      title,
      release_date,
      genres,
      director,
      overview,
      vote_average,
      runtime,
      poster_path,
      original_language,
    } = req.body;
  
    try {
      const { rows } = await pool.query(
        'INSERT INTO movies (title, release_date, genres, director, overview, vote_average, runtime, poster_path, original_language) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;',
        [
          title,
          release_date,
          genres,
          director,
          overview,
          vote_average,
          runtime,
          poster_path,
          original_language,
        ]
      );
  
      if (rows.length === 0) {
        res.status(404).json({ Error: 'Movie not found' });
      } else {
        res.status(201).json(rows[0]);
      }
    } catch (error) {
      console.error('Error when sending the query', error);
      res.status(500).json({ Error: 'Internal Server Error' });
    }
  });
  
  // Route to update a specific movie based on its ID
  app.put('/api/movies/:id', async (req, res) => {
    const { id } = req.params;
    const {
      title,
      release_date,
      genres,
      director,
      overview,
      vote_average,
      runtime,
      poster_path,
      original_language,
    } = req.body;
  
    try {
      const { rows } = await pool.query(
        'UPDATE movies SET title=$1, release_date=$2, genres=$3, director=$4, overview=$5, vote_average=$6, runtime=$7, poster_path=$8, original_language=$9 WHERE id=$10 RETURNING *;',
        [
          title,
          release_date,
          genres,
          director,
          overview,
          vote_average,
          runtime,
          poster_path,
          original_language,
          id,
        ]
      );
  
      if (rows.length === 0) {
        res.status(404).json({ Error: `Movie with the Id ${id} not found!` });
      } else {
        res.status(202).json(rows[0]);
      }
    } catch (error) {
      console.error('Error when sending the query', error);
      res.status(500).json({ Error: 'Internal Server Error' });
    }
  });
  
// route to delete a specific Movie
app.delete('/api/movies/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        const { rows } = await pool.query('DELETE FROM movies WHERE id=$1 RETURNING *;', [id]);
        if (rows.length === 0) {
            res.status(404).json({ Error: `Movie with the Id ${id} not found!` });
        } else {
            res.status(202).json({ message: 'Movie deleted successfully' });
        }
    } catch (error) {
        console.error('Error when deleting movie:', error.message);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
});


// Add a movie to the favorites db
app.post('/api/favorites', async (req, res) => {
  try {
    const { movieId } = req.body;

    // Check if the movieId exists in the movies table before adding to favorites
    const movieQuery = 'SELECT * FROM movies WHERE id = $1;';
    const movieResult = await pool.query(movieQuery, [movieId]);

    if (movieResult.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Check if the movie is already in favorites
    const favoriteQuery = 'SELECT * FROM favorites WHERE movie_id = $1;';
    const favoriteResult = await pool.query(favoriteQuery, [movieId]);

    if (favoriteResult.rows.length === 0) {
      // If the movie is not in favorites, add it to favorites
      const insertQuery = 'INSERT INTO favorites (movie_id) VALUES ($1);';
      await pool.query(insertQuery, [movieId]);
      return res.json({ message: 'Movie added to favorites successfully' });
    } else {
      // If the movie is already in favorites, return a message
      return res.status(200).json({ message: 'Movie is already in favorites' });
    }
  } catch (error) {
    console.error('Error adding to favorites:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Route to request all favorite movies
app.get('/api/favorites', async (req, res) => {
    try {
        const { rows } = await pool.query(
        'SELECT f.id, f.added_date, m.title, m.release_date, m.genres, m.director, m.overview, m.vote_average, m.runtime, m.poster_path, m.original_language FROM favorites f JOIN movies m ON f.movie_id = m.id'
        );
        if (rows.length === 0) {
        res.status(404).json({ Error: 'No Movies Found!' });
        } else {
        res.status(200).json(rows);
        }
        } catch (error) {
        console.error('Error when sending the query', error);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
});



// API endpoint to add a comment to a favorite movie
app.post('/api/favorites/:movieId/comments', async (req, res, next) => {
  const { movieId } = req.params;
  const { text } = req.body;

  try {
    // Check if the favorite movie exists
    const favoriteQuery = 'SELECT * FROM favorites WHERE id = $1;';
    const favoriteResult = await pool.query(favoriteQuery, [movieId]);

    if (favoriteResult.rows.length === 0) {
      const error = new Error('Favorite movie not found');
      error.status = 404;
      return next(error);
    }

    // Insert the comment into the comments table
    const insertQuery = 'INSERT INTO comments (movie_id, text) VALUES ($1, $2) RETURNING *;';
    const insertResult = await pool.query(insertQuery, [movieId, text]);

    if (insertResult.rows.length > 0) {
      res.status(201).json(insertResult.rows[0]);
    } else {
      const error = new Error('Failed to add comment');
      error.status = 500;
      return next(error);
    }
  } catch (error) {
    console.error('Error when adding a comment:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to get all comments for a specific movie in favorites
app.get('/api/favorites/:movieId/comments', async (req, res, next) => {
  const { movieId } = req.params;

  try {
    // Fetch all comments for the specified movie
    const commentsQuery = 'SELECT * FROM comments WHERE movie_id = $1;';
    const commentsResult = await pool.query(commentsQuery, [movieId]);

    res.status(200).json(commentsResult.rows);
  } catch (error) {
    console.error('Error when fetching comments:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a specific favorite Movie
app.delete('/api/favorites/:movieId', async (req, res) => {
  const { movieId } = req.params;

  try {
    // Delete the associated comments
    await pool.query('DELETE FROM comments WHERE movie_id=$1;', [movieId]);

    // Delete the favorite movie
    const { rowCount } = await pool.query('DELETE FROM favorites WHERE id=$1;', [movieId]);

    if (rowCount === 0) {
      res.status(404).json({ Error: `Favorite movie with the Id ${movieId} not found!` });
    } else {
      res.status(202).json({ message: 'Favorite movie deleted successfully' });
    }
  } catch (error) {
    console.error('Error when deleting favorite movie:', error.message);
    res.status(500).json({ Error: 'Internal Server Error' });
  }
});

// Define a route for searching movies by release year
app.get('/api/movies/search', async (req, res) => {
  try {
    const releaseYear = req.query.year; // Get the release year from the query parameters

    // Ensure releaseYear is a valid integer
    if (!isNaN(releaseYear)) {
      // Execute the SQL query to filter movies by release year
      const movies = await pool.query(
        'SELECT * FROM movies WHERE EXTRACT(YEAR FROM release_date) = $1',
        [releaseYear]
      );

      if (movies.rows.length > 0) {
        // Movies matching the release year were found
        res.json(movies.rows);
      } else {
        // No matching movies found
        res.json({ message: 'No movies found for the given year.' });
      }
    } else {
      // Handle the case where releaseYear is not a valid integer
      res.status(400).json({ error: 'Invalid release year.' });
    }
  } catch (error) {
    console.error('Error searching for movies', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


  // Close the connection pool when the application exits
process.on('SIGINT', () => {
    pool.end(() => {
      console.log('Database connection pool closed.');
      process.exit(0);
    });
  });
  

// server running on the Port
app.listen (PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});

