import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { createClient } from 'redis';
import pool from '../accountDB'

const SECRET_KEY = process.env.JWT_SECRET_KEY; // Секрет для JWT
// Создаем клиента Redis с новым API
const client = createClient({
  url: 'redis://localhost:6379', // URL для подключения, можно также указать пароль, если он используется
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
        
            const mailOptions = {
                from: 'defol7@yandex.ru',
                to: userEmail,
                subject: 'Регистрация SwiftDrive',
                html: `
                    <p>Здравствуйте, ${userName}</p>
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
                return new Response(JSON.stringify({ message: 'Код отправлен' }), { status: 200 });
            } catch (error) {
                return new Response({ status: 500 });
            }
        }
    }
    if (sendType === 'verify-code') {
        const { userEmail, code, authType, userName, rawPhone } = await req.json();
        
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
                await client.del(userEmail);
                await pool.query(
                    'INSERT INTO accounts (UserName, UserPhone, UserEmail) VALUES (?, ?, ?)',
                    [userName, rawPhone, userEmail]
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
    