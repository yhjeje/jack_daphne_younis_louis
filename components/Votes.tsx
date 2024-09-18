"use client"; // Marque ce composant comme côté client

import { useEffect, useState } from "react";

interface Vote {
  user_id: number;
  movie_id: number;
  rating: number;
}

interface VotesProps {
  userId: number;
}

export default function Votes({ userId }: VotesProps) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch(`/api/votes?user_id=${userId}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des votes');
        }
        const data = await response.json();
        setVotes(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchVotes();
  }, [userId]);

  if (error) return <div>Erreur : {error}</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Movie ID</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        {votes.length > 0 ? (
          votes.map((vote, i) => (
            <tr key={i}>
              <td>{vote.user_id}</td>
              <td>{vote.movie_id}</td>
              <td>{vote.rating}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3}>Aucun vote trouvé</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
