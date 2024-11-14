import { NextRequest, NextResponse } from "next/server";
import accountDB from '../../../accountDB';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionKey = searchParams.get('SessionId');

        if (!sessionKey) {
            return NextResponse.json({ message: "SessionId не предоставлен" }, { status: 400 });
        }

        // Используем `RowDataPacket` как тип для результата
        const results = await new Promise<Array<{ SessionKey: string }>>((resolve, reject) => {
            accountDB.query(
                `SELECT SessionKey FROM eatAccounts WHERE SessionKey = ?`,
                [sessionKey],
                (err: any, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results as Array<{ SessionKey: string }>);
                    }
                }
            );
        });

        if (results.length === 0) {
            return NextResponse.json({ message: "SessionKey не найден" }, { status: 404 });
        }

        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json(
            { message: error.toString() },
            { status: 500 }
        );
    }
}