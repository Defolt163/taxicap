import accountDB from '../accountDB'
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
            const { analytics, necessary, policy_version } = await req.json();
            const forwardedFor = req.headers.get('x-forwarded-for');
            const clientIp = forwardedFor?.split(',')[0].trim() || req.headers.get('x-real-ip') || null;
            const now = new Date();

            function generateRandomString(length) {
                if (length <= 0) return '';

                const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
                let result = '';

                for (let i = 0; i < length; i++) {
                    result += alphabet[Math.floor(Math.random() * alphabet.length)];
                }

                return result;
            }
            let consentId = generateRandomString(64)

            await accountDB.query(
                'INSERT INTO cookie_subscriptions (user_ip, consent_id, analytics, necessary, policy_version) VALUES (?, ?, ?, ?, ?)',
                [clientIp, consentId, analytics, necessary, policy_version]
            );


            return new Response(
                JSON.stringify({consentId}),
                { status: 200 }
            );
    } catch (err) {
        //console.error('Ошибка регистрации:', err);
        return new Response(
            JSON.stringify({ message: 'Ошибка' }),
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
            const cookieStore = await cookies();      // Next 15+
            const consentId = cookieStore.get('consent_id')?.value;
            console.log(consentId)

            const [rows] = await accountDB.query(
                'SELECT `consent_id`, `analytics`, `necessary`, `policy_version` FROM `cookie_subscriptions` WHERE `consent_id` = ?',
                consentId
            );

            if (rows.length > 0) {
                return new Response( JSON.stringify(rows[0]),
                { status: 400 }
                );
            }


            return new Response(
                JSON.stringify({rows}),
                { status: 200 }
            );
    } catch (err) {
        //console.error('Ошибка регистрации:', err);
        return new Response(
            JSON.stringify({ message: 'Ошибка' }),
            { status: 500 }
        );
    }
}