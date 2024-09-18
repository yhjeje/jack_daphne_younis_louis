"use client"; // Marque ce composant comme côté client

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession } from "@/utils/sessions"; // Importer la fonction pour obtenir la session

interface Vote {
  user_id: number;
  movie_id: number;
  rating: number;
}

const movieTitles: { [key: number]: string } = {
  1: "Mad Max",
  2: "Pacific Rim",
 
};

export default function Home() {
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
          throw new Error('Erreur lors de la récupération des votes');
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
        <span>{email}</span>
      </div>
      <h1>MON COMPTE</h1>
      <Link href="/mon-compte/profil">Mon profil</Link>

      <h2>Mes Votes</h2>
      {error && <p>Erreur : {error}</p>}
      {votes.length > 0 ? (
        <div>
          {votes.map((vote, index) => (
            <div key={index}>
              {email} a voté pour le film {movieTitles[vote.movie_id] || 'Inconnu'}
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun vote trouvé</p>
      )}
    </>
  );
}
