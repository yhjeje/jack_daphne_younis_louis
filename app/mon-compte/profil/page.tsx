"use client"; 

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession } from "@/utils/sessions"; 

interface Vote {
  user_id: number;
  movie_id: number;
  rating: number;
}

export default function Profil() {
  const [email, setEmail] = useState<string>('');
  const [userId, setUserId] = useState<number | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setEmail(session.email || '');
        setUserId(session.rowid || null); 
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (userId === null) return;

    const fetchVotes = async () => {
      try {
        const response = await fetch(`/api/votes?user_id=${userId}`);
        if (!response.ok) {
          throw new Error('Vous avez deja voté');
        }
        const data = await response.json();
        setVotes(data);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchVotes();
  }, [userId]);

  return (
    <>
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}>
        <a href="/mon-compte/">{email}</a>
      </div>
      <h1>MON PROFIL</h1>
      <Link href="/mon-compte/voter">Voter</Link>
      <h2>Mes Votes</h2>
      {error && <p>Erreur : {error}</p>}
      {votes.length > 0 ? (
        <ul>
          {votes.map((vote, index) => (
            <li key={index}>
              {email} a voté pour le film {vote.movie_id === 1 ? 'Mad Max' : 'Pacific Rim'} avec une note de {vote.rating}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun vote trouvé</p>
      )}
    </>
  );
}
