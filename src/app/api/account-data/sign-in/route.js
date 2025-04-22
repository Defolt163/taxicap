import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import pool from '../../accountDB';

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

export async function POST(req) {
    try {
        const { email } = await req.json();

        // Проверка пользователя
        console.log('Получен логин:', email);
        const [rows] = await pool.query('SELECT UserId, UserEmail FROM accounts WHERE UserEmail = ?', [email]);

        if (rows.length === 0) {
            console.log('Пользователь не найден');
            return new Response(
                JSON.stringify({ message: 'Не найден' }),
                { status: 404 }
            );
        }

        const user = rows[0];
        console.log('Найден пользователь:', user);

        // Проверка пароля
        //const isMatch = await bcrypt.compare(password, user.UserPassword)

        /* if (!isMatch) {
            console.log('Неверный пароль');
            return new Response(
                JSON.stringify({ message: 'Неверный пароль' }),
                { status: 401 }
            );
        } */

        // Генерация JWT
        const token = jwt.sign(
            {
                id: rows[0].UserId,
                email: rows[0].UserEmail
            },
            SECRET_KEY,
            { expiresIn: '7d' }
        );
        console.log('Сгенерирован токен:', token);
        // Преобразуем данные из базы в строку
        const dataToEncrypt = JSON.stringify(rows);
        // Шифруем данные
        const { iv, encryptedData } = encryptData(dataToEncrypt);

        return new Response(
            JSON.stringify({ token, encryptedData, iv  }),
            { status: 200 }
        );
    } catch (err) {
        console.error('Ошибка на сервере:', err);
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500 }
        );
    }
}

async function getUserFromToken(token) {
    try {
        console.log('Токен, который пришел на сервер:', token);

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('Декодированный токен:', decoded);

        const userId = decoded.id;
        console.log('Результаты запроса в базу данных11:', decoded.id);
        const [rows] = await pool.query('SELECT a.*, m.UserPhoto, m.Approved, m.PhotoWarningDescription FROM accounts a JOIN userphoto m ON a.UserId = m.User WHERE a.UserId = ?', [decoded.id]);
        console.log('Результаты запроса в базу данных:', rows);
        const newToken = jwt.sign(
            {
                id: rows[0].UserId,
                email: rows[0].UserEmail,
            },
            SECRET_KEY,
            { expiresIn: '7d' }
        );

        if (rows.length === 0) {
            throw new Error('User not found');
        }
        console.log('Сгенерирован новый токен:', newToken);

        /* return new Response(
            JSON.stringify({ message: 'Готово', token }),
            { status: 201 }
        ); */
        //const sanitizedRows = rows.map(({ UserId, ...rest }) => rest);
        // Преобразуем данные из базы в строку
        const dataToEncrypt = JSON.stringify(rows);
        // Шифруем данные
        const { iv, encryptedData } = encryptData(dataToEncrypt);
        return { newToken, user: {iv, encryptedData} };
    } catch (error) {
        console.error('Ошибка при декодировании токена или запросе пользователя:', error);
        throw new Error('Invalid token or user not found');
    }
}

export async function GET(req) {
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
        console.log('Токен не предоставлен');
        return new Response(JSON.stringify({ message: 'Tокен не предоставлен' }), { status: 401 });
    }

    try {
        const user = await getUserFromToken(token);
        console.log('Данные пользователя:', user);
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error('Ошибка при получении пользователя:', error.message);
        return new Response(JSON.stringify(), { status: 401 });
    }
}
