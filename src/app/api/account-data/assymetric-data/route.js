import crypto from 'crypto';
import { NextResponse } from 'next/server';
import pool from '../../accountDB'; // Подключение к базе данных

const SECRET_KEY = '16cf126a9dc4e39e405a03ad0fb2f31d91f6b73342c7d7647772e104aa8d7e39'; // Ключ для генерации IV

// Преобразуем строку в буфер, если это нужно для алгоритма
const key = Buffer.from(SECRET_KEY, 'hex'); // Конвертируем в Buffer для использования в шифровании

//console.log("YJDSSSQНОВЫЙ", key)
const ALGORITHM = 'aes-256-cbc'; // Алгоритм для симметричного шифрования
const IV_LENGTH = 16; // Длина вектора инициализации

// Функция для генерации случайного IV
function generateIV() {
    return crypto.randomBytes(IV_LENGTH);
}

// Функция для шифрования данных
function encryptData(data) {
    const iv = generateIV(); // Генерация случайного IV
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, 'utf-8'), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
}

// Функция для обработки запроса
export async function POST(request) {
    try {
        const { userId } = await request.json(); // Допустим, мы получаем userId для запроса данных из БД
        console.log("Получен userId:", userId);

        // Получаем данные из БД (это пример, адаптируй под свою базу)
        const [rows] = await pool.query('SELECT * FROM accounts WHERE UserId = ?', [userId]);
        console.log('Результаты запроса в базу данных:', rows);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Преобразуем данные из базы в строку
        const dataToEncrypt = JSON.stringify(rows);

        // Шифруем данные
        const { iv, encryptedData } = encryptData(dataToEncrypt);

        // Отправляем зашифрованные данные и IV на клиент
        return new Response(
            JSON.stringify({ encryptedData, iv }),
            { status: 200 }
        );
        //return NextResponse.json({ encryptedData, iv });
    } catch (error) {
        console.error('Ошибка при запросе данных:', error);
        return NextResponse.json({ error: 'Ошибка при запросе данных', details: error.message }, { status: 500 });
    }
}
