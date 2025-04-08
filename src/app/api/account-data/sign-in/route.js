import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../../accountDB';

const SECRET_KEY = process.env.JWT_SECRET_KEY; // Секрет для JWT

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // Проверка пользователя
        console.log('Получен логин:', email);
        const [rows] = await pool.query('SELECT * FROM users WHERE UserEmail = ?', [email]);

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
        const isMatch = await bcrypt.compare(password, user.UserPassword)

        if (!isMatch) {
            console.log('Неверный пароль');
            return new Response(
                JSON.stringify({ message: 'Неверный пароль' }),
                { status: 401 }
            );
        }

        // Генерация JWT
        const token = jwt.sign(
            {
                id: user.UserId,
                name: user.UserName,
                email: user.UserEmail,
                role: user.UserRole,
            },
            SECRET_KEY,
            { expiresIn: '7d' }
        );
        console.log('Сгенерирован токен:', token);

        return new Response(
            JSON.stringify({ token }),
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

        const [rows] = await pool.query('SELECT UserId, UserName, UserEmail, UserRole FROM users WHERE UserId = ?', [userId]);
        console.log('Результаты запроса в базу данных:', rows);
        const newToken = jwt.sign(
            {
                id: rows[0].UserId,
                name: rows[0].UserName,
                email: rows[0].UserEmail,
                role: rows[0].UserRole,
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
        const sanitizedRows = rows.map(({ UserId, ...rest }) => rest);

        return { newToken, rows: sanitizedRows };
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
