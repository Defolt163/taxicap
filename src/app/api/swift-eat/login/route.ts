import { NextRequest, NextResponse } from "next/server";
import accountDB from '../../accountDB';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json(); // Получаем данные из тела запроса

        const results = await new Promise<Array<{
            SessionKey: string,
            RestaurantName: string,
            RestaurantAddress: string,
            RestaurantOwner: string,
            RestaurantLogo: string,
            TimeUp: string,
            TimeOut: string
        }>>((resolve, reject) => {
            accountDB.query(`SELECT SessionKey, RestaurantName, RestaurantAddress, RestaurantOwner, RestaurantLogo, TimeUp, TimeOut FROM eatAccounts WHERE Email = '${email}' AND Password = '${password}'`, (err: any, results: Array<{
                SessionKey: string,
                RestaurantName: string,
                RestaurantAddress: string,
                RestaurantOwner: string,
                RestaurantLogo: string,
                TimeUp: string,
                TimeOut: string
            }>) => {
                if (err) {
                    reject(err);
                } if(results.length !== 0){
                    console.log("Вход в СвифтЕда");
                    resolve(results);
                }
            });
        });

        // Здесь следует добавить логику проверки пароля
        const userEmails = results.map((result) => result);
        return NextResponse.json(userEmails);
    } catch (error) {
        return NextResponse.json(
            { message: error },
            { status: 500 }
        );
    }
}