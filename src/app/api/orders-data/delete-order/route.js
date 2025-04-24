import { NextResponse } from 'next/server';
import pool from '../../accountDB';
import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET_KEY; // Секрет для JWT

export async function DELETE(req) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return new Response(JSON.stringify({ message: 'Tокен не предоставлен' }), { status: 401 });
  }
  try {;
    const decoded = jwt.verify(token, SECRET_KEY)

    await pool.query(
      'DELETE FROM orders WHERE OrderStatus = "created" AND UserId = ?', [decoded.id]
    );

    return new Response({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
}
