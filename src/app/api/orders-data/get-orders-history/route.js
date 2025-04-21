import pool from '../../accountDB'
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET_KEY; // Секрет для JWT
// Шифрование

const DATA_SECRET_KEY = process.env.DATA_SECRET_KEY /* '16cf126a9dc4e39e405a03ad0fb2f31d91f6b73342c7d7647772e104aa8d7e39'; */ // Ключ для генерации IV
const DataBufferKey = Buffer.from(DATA_SECRET_KEY, 'hex');
const ALGORITHM = 'aes-256-cbc'; // Алгоритм для симметричного шифрования
const IV_LENGTH = 16; // Длина вектора инициализации
// Функция для генерации случайного IV
function generateIV() {
    return crypto.randomBytes(IV_LENGTH);
}
function encryptData(data) {
    const iv = generateIV(); // Генерация случайного IV
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(DataBufferKey, 'utf-8'), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
}


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
        const [rows] = await pool.query(`
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