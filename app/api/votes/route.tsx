import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
  filename: process.env.DATABASE_NAME || '',
  driver: sqlite3.Database,
});

export async function GET(req: NextRequest) {
  try {
    console.log('Received GET request for /api/votes');
    console.log('Request URL:', req.url);

    const url = new URL(req.url);
    const userId = url.searchParams.get('user_id');

    if (!userId) {
      console.log('User ID is missing from the query parameters');
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    console.log('User ID:', userId);

    const db = await dbPromise;
    const votes = await db.all(
      'SELECT * FROM votes WHERE user_id = ?',
      [userId]
    );

    console.log('Votes retrieved:', votes);

    return NextResponse.json(votes);
  } catch (error) {
    console.error('Error in /api/votes:', error);
    return NextResponse.json({ message: 'Error retrieving votes' }, { status: 500 });
  }
}
