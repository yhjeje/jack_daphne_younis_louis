"use client"; 

import { useState, useEffect } from "react";
import { getSession } from "@/utils/sessions";

interface Movie {
  id: number;
  title: string;
}

export default function VotePage() {
  const [email, setEmail] = useState<string>('');
  const [userId, setUserId] = useState<number | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setEmail(session.email || '');
        setUserId(session.rowid || null); 
      }
    };

    setMovies([
      { id: 1, title: 'Mad Max' },
      { id: 2, title: 'Pacific Rim' },

    ]);

    fetchSession();
  }, []);

  const handleVote = async () => {
    if (userId === null || selectedMovie === null) {
      setMessage('Veuillez sélectionner un film et entrer une note.');
      return;
    }

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          movie_id: selectedMovie,
          rating,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement du vote');
      }

      setMessage('Vote enregistré avec succès.');
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <>
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}>
        <span>{email}</span>
      </div>
      <h1>Voter</h1>
      <div>
        <label htmlFor="movie">Choisissez un film :</label>
        <select id="movie" onChange={(e) => setSelectedMovie(Number(e.target.value))}>
          <option value="">--Sélectionnez un film--</option>
          {movies.map(movie => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="rating">Note :</label>
        <input
          type="number"
          id="rating"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
      </div>
      <button onClick={handleVote}>Soumettre</button>
      {message && <p>{message}</p>}
    </>
  );
}
