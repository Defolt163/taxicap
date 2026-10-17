import pool from '../accountDB'
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
        return Response.json({ message: 'Токен не предоставлен' }, { status: 401 });
    }

    try {
        jwt.verify(token, SECRET_KEY);
    } catch (err) {
        console.error('JWT error:', err.message);
        return Response.json({ message: 'Неверный токен' }, { status: 401 });
    }

    if (q.length < 2) {
        return Response.json({ rows: [] });
    }

    // Есть ли цифра в запросе → значит ищем дом
    const hasDigit = /\d/.test(q);

    try {
        let sql, params;

        if (!hasDigit) {
        // === РЕЖИМ 1: поиск ТОЛЬКО улиц ===
        sql = `
            SELECT MIN(id) AS id, street
            FROM address_houses
            WHERE street LIKE CONCAT(?, '%')
            OR street LIKE CONCAT('% ', ?, '%')
            GROUP BY street
            ORDER BY
                CASE
                    WHEN street LIKE CONCAT(?, '%') THEN 0
                    ELSE 1
                END,
                street
            LIMIT 10
        `;
        params = [q, q, q];
        } else {
        // === РЕЖИМ 2: поиск домов ===
        // Ожидаем формат "Улица 12", "Улица, 12", "Улица 12а"
        const m = q.match(/^(.+?)[\s,]+(\d+[а-яa-z]?(?:\/\d+)?)$/i);

        if (!m) {
            // Цифра есть, но формат не распознан (например, "12")
            // Ищем просто по house — пользователь ввёл только номер
            sql = `
            SELECT id, street, house, lat, lon,
                    CONCAT(street, ', ', house) AS address
            FROM address_houses
            WHERE house LIKE CONCAT(?, '%')
            ORDER BY street, CAST(house AS UNSIGNED), house
            LIMIT 10
            `;
            params = [q];
        } else {
            const streetPart = m[1].trim();
            const housePart  = m[2];

            sql = `
            SELECT id, street, house, lat, lon,
                    CONCAT(street, ', ', house) AS address
            FROM address_houses
            WHERE (
                street LIKE CONCAT(?, '%')
                OR street LIKE CONCAT('% ', ?, '%')
                OR street LIKE CONCAT('%', ?, '%')
            )
            AND house LIKE CONCAT(?, '%')
            ORDER BY
                CASE WHEN street LIKE CONCAT(?, '%') THEN 0 ELSE 1 END,
                street, CAST(house AS UNSIGNED), house
            LIMIT 10
            `;
            params = [streetPart, streetPart, streetPart, housePart, streetPart];
        }
        }
        // Предприятия: поиск по названию и альтернативным названиям
        const [places] = await pool.query(
            `SELECT id, name, address, lat, lon, 'place' AS type
             FROM places
             WHERE name LIKE CONCAT(?, '%')
                OR name LIKE CONCAT('% ', ?, '%')
                OR aliases LIKE CONCAT('%', ?, '%')
             ORDER BY (name LIKE CONCAT(?, '%')) DESC, name
             LIMIT 5`,
            [q, q, q, q]
        );

        const [rows] = await pool.query(sql, params);

        // Помечаем режим в ответе — удобно для фронта
        return Response.json([...places, ...rows]);
    } catch (error) {
        console.error('DB error:', error.message);
        return Response.json({ message: 'Ошибка сервера' }, { status: 500 });
    }
}