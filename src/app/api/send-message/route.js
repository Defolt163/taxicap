import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { randomInt } from 'crypto';
import { createClient } from 'redis';
import pool from '../accountDB'
import { checkRateLimit } from '../rateLimit'

const SECRET_KEY = process.env.JWT_SECRET_KEY; // Секрет для JWT
const { REDIS_URL, REDIS_PORT } = process.env;
// Создаем клиента Redis с новым API
const client = createClient({
  url: `redis://${REDIS_URL}:${REDIS_PORT}`, // URL для подключения, можно также указать пароль, если он используется
});

client.connect(); // Подключаемся к Redis

client.on('connect', () => {
  console.log('Подключено к Redis');
});

client.on('error', (err) => {
  console.error('Ошибка Redis:', err);
});
export async function POST(req) {
    const { searchParams } = new URL(req.url);
    const sendType = searchParams.get("type");
    if(sendType == 'feedback'){
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return new Response('Unauthorized', { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { userMessage } = await req.json();
    
        const transporter = nodemailer.createTransport({
            service: 'yandex',
            auth: {
                user: 'defol7@yandex.ru',
                pass: 'wbhoblkcgtjtxzjl',
            },
        });
    
        const mailOptions = {
            from: 'defol7@yandex.ru',
            to: 'iperrogames346@gmail.com',
            subject: 'Обратная связь',
            html: `
                <p>Пришло обращение от пользователя Email: ${decoded.email}, Id: ${decoded.id}<br><br>Обращение:</p>
                <blockquote>
                    <p>${userMessage}</p>
                </blockquote>
            `
        };
        try {
            await transporter.sendMail(mailOptions);
            return new Response({ status: 200 });
        } catch (error) {
            return new Response({ status: 500 });
        }
    }else if(sendType == 'send-code'){
        const { userEmail, authType, rawPhone, userName } = await req.json();
        if (authType === 'email-change') {
            const token = req.headers.get('authorization')?.split(' ')[1];
            if (!token) return Response.json({ message: 'Необходима авторизация' }, { status: 401 });

            let decoded;
            try {
                decoded = jwt.verify(token, SECRET_KEY);
            } catch {
                return Response.json({ message: 'Недействительная сессия' }, { status: 401 });
            }

            try {
                const rateLimit = await checkRateLimit('email-change-code', decoded.id, 3, 600);
                if (!rateLimit.allowed) {
                    return Response.json(
                        { message: 'Слишком много запросов. Попробуйте позже.' },
                        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } }
                    );
                }
            } catch (error) {
                console.error('Email change rate limiter unavailable:', error);
            }

            const normalizedEmail = userEmail?.trim().toLowerCase();
            if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
                return Response.json({ message: 'Некорректный email' }, { status: 400 });
            }

            const [currentUserRows] = await pool.query(
                'SELECT UserEmail FROM accounts WHERE UserId = ?',
                [decoded.id]
            );
            if (!currentUserRows.length) return Response.json({ message: 'Пользователь не найден' }, { status: 404 });
            if (currentUserRows[0].UserEmail?.toLowerCase() === normalizedEmail) {
                return Response.json({ message: 'Это уже ваш текущий email' }, { status: 400 });
            }

            const [existingUsers] = await pool.query(
                'SELECT UserId FROM accounts WHERE UserEmail = ? AND UserId <> ? LIMIT 1',
                [normalizedEmail, decoded.id]
            );
            if (existingUsers.length) {
                return Response.json({ message: 'Эта электронная почта уже используется' }, { status: 409 });
            }

            const generatedCode = String(randomInt(100000, 1000000));
            if (process.env.NODE_ENV !== 'production') {
                console.info('[email-change] Verification code:', generatedCode);
            }
            const redisKey = `email-change:${decoded.id}:${normalizedEmail}`;
            await client.setEx(redisKey, 600, generatedCode);

            const transporter = nodemailer.createTransport({
                service: 'yandex',
                auth: {
                    user: 'defol7@yandex.ru',
                    pass: 'wbhoblkcgtjtxzjl',
                },
            });

            await transporter.sendMail({
                from: 'defol7@yandex.ru',
                to: normalizedEmail,
                subject: 'Подтверждение нового email',
                html: `<p>Ваш код подтверждения нового адреса email:</p><p style="font-size:24px"><strong>${generatedCode}</strong></p><p>Код действует 10 минут.</p>`,
            });

            return Response.json({ message: 'Код отправлен' });
        }

        if(authType === 'sign-up' && rawPhone === ''){
            const [rows] = await pool.query('SELECT * FROM accounts WHERE UserEmail = ?', [userEmail]);

            if (rows.length > 0) {
                return new Response(
                    JSON.stringify({ message: 'Пользователь уже существует' }),
                    { status: 400 }
                );
            } else {
                const generatedCode = Math.floor(1000 + Math.random() * 9000)
                console.log(`Код для ${userEmail}: ${generatedCode}`);
                await client.setEx(userEmail, 6000, String(generatedCode));
                console.log(`Код для ${userEmail} сохранен в Redis`);
                
                const transporter = nodemailer.createTransport({
                    service: 'yandex',
                    auth: {
                        user: 'defol7@yandex.ru',
                        pass: 'wbhoblkcgtjtxzjl',
                    },
                });
            
                const mailOptions = {
                    from: 'defol7@yandex.ru',
                    to: userEmail,
                    subject: 'Авторизация SwiftDrive',
                    html: `
                        <p>Здравствуйте!</p>
                        <p><span style="font-size: 18pt;">Ваш код для подтверждения Email:</span></p>
                        <p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;">
                            <span style="font-size: 24pt;"><strong>${generatedCode}</strong></span>
                        </p>
                        <p>Если это сообщение отправлено вам по ошибке, просто проигнорируйте его</p>
                        <p>&nbsp;</p>
                        <blockquote>
                        <p><span style="text-decoration: underline;">С уважением SwiftDrive</span></p>
                        </blockquote>
                    `
                };
            
                try {
                    await transporter.sendMail(mailOptions);
                    return new Response(JSON.stringify(), { status: 200 });
                } catch (error) {
                    return new Response({ status: 500 });
                }
                return new Response(
                    JSON.stringify(),
                    { status: 404 }
                );
            }
        }else{
            const [rows] = await pool.query('SELECT UserEmail FROM accounts WHERE UserEmail = ?', [userEmail]);
            console.log('DLINA', rows.length)
            if (rows.length <= 0) {
                return new Response(
                    JSON.stringify({ message: 'Пользователя нет' }),
                    { status: 404 }
                );
            }
            const generatedCode = Math.floor(1000 + Math.random() * 9000)
            console.log(`Код для ${userEmail}: ${generatedCode}`);
            await client.setEx(userEmail, 6000, String(generatedCode));
            console.log(`Код для ${userEmail} сохранен в Redis`);
            
            const transporter = nodemailer.createTransport({
                service: 'yandex',
                auth: {
                    user: 'defol7@yandex.ru',
                    pass: 'wbhoblkcgtjtxzjl',
                },
            });

            console.log("transporter", transporter)
        
            const mailOptions = {
                from: 'defol7@yandex.ru',
                to: userEmail,
                subject: 'Авторизация REVVO',
                html: `
                    <p>Здравствуйте, ${userName}</p>
                    <p><span style="font-size: 18pt;">Ваш код для подтверждения Email:</span></p>
                    <p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;">
                        <span style="font-size: 24pt;"><strong>${generatedCode}</strong></span>
                    </p>
                    <p>Если это сообщение отправлено вам по ошибке, просто проигнорируйте его</p>
                    <p>&nbsp;</p>
                    <blockquote>
                    <p><span style="text-decoration: underline;">С уважением REVVO</span></p>
                    </blockquote>
                `
            };
        
            try {
                await transporter.sendMail(mailOptions);
                return new Response(JSON.stringify({ message: 'Код отправлен' }), { status: 200 });
            } catch (error) {
                return new Response({ status: 500 });
            }
        }
    }
    if (sendType === 'verify-code') {
        const { userEmail, code, authType, userName, rawPhone, personalDataConsent, userPhone } = await req.json();

        if (authType === 'email-change' && code !== '') {
            const token = req.headers.get('authorization')?.split(' ')[1];
            if (!token) return Response.json({ message: 'Необходима авторизация' }, { status: 401 });

            let decoded;
            try {
                decoded = jwt.verify(token, SECRET_KEY);
            } catch {
                return Response.json({ message: 'Недействительная сессия' }, { status: 401 });
            }

            const normalizedEmail = userEmail?.trim().toLowerCase();
            const redisKey = `email-change:${decoded.id}:${normalizedEmail}`;
            const storedCode = await client.get(redisKey);
            if (!storedCode || storedCode !== String(code).trim()) {
                return Response.json({ message: 'Неверный или истекший код' }, { status: 401 });
            }

            const [existingUsers] = await pool.query(
                'SELECT UserId FROM accounts WHERE UserEmail = ? AND UserId <> ? LIMIT 1',
                [normalizedEmail, decoded.id]
            );
            if (existingUsers.length) {
                await client.del(redisKey);
                return Response.json({ message: 'Эта электронная почта уже используется' }, { status: 409 });
            }

            await pool.query(
                'UPDATE accounts SET UserName = ?, UserPhone = ?, UserEmail = ? WHERE UserId = ?',
                [userName, userPhone, normalizedEmail, decoded.id]
            );
            await client.del(redisKey);

            const [updatedUsers] = await pool.query(
                'SELECT UserId, UserName, UserEmail, DriverMode FROM accounts WHERE UserId = ?',
                [decoded.id]
            );
            const updatedUser = updatedUsers[0];
            const updatedToken = jwt.sign({
                id: updatedUser.UserId,
                name: updatedUser.UserName,
                email: updatedUser.UserEmail,
                role: updatedUser.DriverMode,
            }, SECRET_KEY, { expiresIn: '7d' });

            return Response.json({ token: updatedToken, email: updatedUser.UserEmail });
        }
        
        if(authType === 'sign-in'){
            const storedCode = await client.get(userEmail); 
            console.log("REDIS CODE", storedCode);
            if (!storedCode) {
            return new Response(JSON.stringify({ success: false, message: 'Код не найден или истек' }), { status: 401 });
            }
            // Если код совпал
            if (storedCode === code) {
                console.log('Код верный');
                // Удаляем код из Redis, чтобы он больше не использовался
                await client.del(userEmail);
        
                const [rows] = await pool.query('SELECT UserId, UserEmail FROM accounts WHERE UserEmail = ?', [userEmail]);
                // Генерация JWT
                const token = jwt.sign(
                    {
                        id: rows[0].UserId,
                        email: rows[0].UserEmail
                    },
                    SECRET_KEY,
                    { expiresIn: '7d' }
                );
                return new Response(
                    JSON.stringify({ token }),
                    { status: 200 }
                );
            } else {
                return new Response(JSON.stringify({ success: false, message: 'Неверный код' }), { status: 401 });
            }
        }else if(authType === 'sign-up' && code !== ''){
            const storedCode = await client.get(userEmail); 
            console.log("REDIS CODE", storedCode);
            if (!storedCode) {
                return new Response(JSON.stringify({ success: false, message: 'Код не найден или истек' }), { status: 401 });
            }
            if (rawPhone == '' && storedCode === code) {
                console.log('Код 200');
                return new Response(
                    JSON.stringify({message: 'OK'}),
                    { status: 200 }
                );
            } else if(rawPhone !== '' && storedCode === code){
                if (personalDataConsent !== true) {
                    return new Response(JSON.stringify({ success: false, message: 'Необходимо согласие на обработку персональных данных' }), { status: 400 });
                }

                const forwardedFor = req.headers.get('x-forwarded-for');
                const consentIp = forwardedFor?.split(',')[0].trim() || req.headers.get('x-real-ip') || null;

                await client.del(userEmail);
                await pool.query(
                    `INSERT INTO accounts
                        (UserName, UserPhone, UserEmail, PersonalDataConsent, PersonalDataConsentAt, PersonalDataConsentIp)
                     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
                    [userName, rawPhone, userEmail, personalDataConsent, consentIp]
                );
      
                // Получение сохраненного пользователя
                const [newRows] = await pool.query('SELECT UserId FROM accounts WHERE UserEmail = ?', [userEmail]);
                const user = newRows[0];
                await pool.query(
                  'INSERT INTO userphoto (User) VALUES (?)',
                  [user.UserId]
                )
                // Генерация токена
                const token = jwt.sign(
                    {
                        id: user.UserId,
                        name: user.UserName,
                        email: user.UserEmail,
                    },
                    SECRET_KEY,
                    { expiresIn: '7d' }
                );
    
                return new Response(
                    JSON.stringify({ token }),
                    { status: 200 }
                );
            } else {
                return new Response(JSON.stringify({ success: false, message: 'Неверный код' }), { status: 401 });
            }
        }
        /* console.log("validCode", validCode);
        if (code === validCode) {
            codes.delete(userEmail); // удаляем после использования
            console.log("Код верный")
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ success: false, message: 'Неверный код' }), { status: 401 });
        } */
    }
    
}
    