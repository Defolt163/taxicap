import { NextRequest, NextResponse } from "next/server"
import db from '../../../accountDB'

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const params = new URLSearchParams(url.search);
        const userId = params.get('UserId');
        const result: any = await new Promise((resolve, reject) => {

            db.query(
                "SELECT id FROM orders WHERE UserId = ? AND (OrderStatus = 'active' OR OrderStatus = 'created')",
                [userId],
                (err: any, results: any) => {
                    if (err) {
                    reject(err);
                    } else {
                    resolve(results);
                    }
                }
            );
          });
        console.log(result);
        const userEmails = result.map((result) => result);
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