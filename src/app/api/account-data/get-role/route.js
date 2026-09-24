import pool from '../../accountDB'
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET_KEY; // Секрет для JWT


export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userStatus = searchParams.get("status");
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
        console.log('Токен не предоставлен');
        return new Response(JSON.stringify({ message: 'Tокен не предоставлен' }), { status: 401 });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const role = await pool.query(`
            ${userStatus == 'passenger' ? 'SELECT * FROM orders WHERE UserId = ? AND OrderStatus = "completed"' : 
            userStatus == 'driver' ? 'SELECT * FROM orders WHERE DriverId = ? AND OrderStatus = "completed"' : null}`, [decoded.id, userStatus]);
        console.log('Результаты запроса в базу данных:', rows);

        // Преобразуем данные из базы в строку
        const dataToEncrypt = JSON.stringify(rows);
        console.log('шифрование:', dataToEncrypt);
        // Шифруем данные
        const { iv, encryptedData } = encryptData(dataToEncrypt);
        return new Response(
            JSON.stringify({ orders: { encryptedData, iv } }),
            { status: 200 }
          );          
    }
    catch (error) {
        console.error('Ошибка при получении пользователя:', error.message);
        return new Response(JSON.stringify(), { status: 401 });
    }
}