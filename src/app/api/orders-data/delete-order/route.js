import { NextResponse } from 'next/server';
import pool from '../../accountDB';
import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET_KEY; // Секрет для JWT

export async function DELETE(req) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return new Response(JSON.stringify({ message: 'Tокен не предоставлен' }), { status: 401 });
  }
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Параметр id не указан' }, { status: 400 });
    }
    await pool.query(
      'DELETE FROM orders WHERE id = ?', [orderId]
    );

    /* if (results.affectedRows === 0) {
      return NextResponse.json({ message: 'Запись не найдена' }, { status: 404 });
    } */

    return NextResponse.json({ message: 'Запись успешно удалена' });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
}
