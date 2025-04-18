import { NextRequest, NextResponse } from "next/server"
import pool from '../../accountDB'

/* export async function PUT(request: NextRequest) {
  try {
    if (request.method === 'PUT') {
      const url = new URL(request.url);
      const params = new URLSearchParams(url.search);
      const sessionId = params.get('UserSessionId');

      if (!sessionId) {
        return NextResponse.json({ message: "Invalid UserSessionId" }, { status: 400 });
      }

      const { DriverMode } = await request.json();

      const result: any = await new Promise((resolve, reject) => {

        db.query(
            "UPDATE accounts SET DriverMode = ? WHERE UserSessionId = ?",
            [DriverMode, sessionId],
            (err: any, results: any) => {
                if (err) {
                reject(err);
                } else {
                resolve(results);
                }
            }
        );
      });

      if (result && result.affectedRows === 1) {
        return NextResponse.json({ message: "User updated successfully" });
      } else {
        return NextResponse.json({ message: "Failed to update user" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: "Invalid method" }, { status: 405 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
 */
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY; // Секрет для JWT

export async function changeMode(token, driverMode) {
    try {
        console.log('Токен, который пришел на сервер:', token);
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('Декодированный токен:', decoded.id);
        console.log('Изменяем режим на:', driverMode)
        pool.query(
          'UPDATE accounts SET DriverMode = ? WHERE UserId = ?', [driverMode, decoded.id]
        );

    } catch (err) {
        console.error('Ошибка на сервере:', err);
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500 }
        );
    }
}

export async function POST(req) {
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
        console.log('Токен не предоставлен');
        return new Response(JSON.stringify({ message: 'Tокен не предоставлен' }), { status: 401 });
    }
    const { driverMode } = await req.json(); // 👈 получаем из body
    console.log('Полученный driverMode:', driverMode);
    try {
        const user = await changeMode(token, driverMode);
        console.log('Данные пользователя:', user);
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error('Ошибка при получении пользователя:', error.message);
        return new Response(JSON.stringify(), { status: 401 });
    }
}
