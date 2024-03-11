import { NextRequest, NextResponse } from "next/server"
import accountDB from '../../accountDB'

export async function GET(request: NextRequest) {
    try {
        const nextUrl = new URL(request.nextUrl);
        const inputEmail = nextUrl.searchParams.get('inputEmail');
        const results = await new Promise<Array<{ UserEmail: string }>>((resolve, reject) => {
            accountDB.query(`SELECT UserEmail FROM accounts WHERE UserEmail = '${inputEmail}'`, (err: any, results: Array<{ UserEmail: string }>) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("OK");
                    resolve(results);
                }
            });
        });
        console.log(results);
        const userEmails = results.map((result) => result.UserEmail);
        return NextResponse.json(userEmails);
    } catch (error) {
        return NextResponse.json(
            { message: error },
            {
                status: 500
            }
        );
    }
}