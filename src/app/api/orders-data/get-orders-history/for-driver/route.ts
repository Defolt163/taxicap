import { NextRequest, NextResponse } from "next/server"
import accountDB from '../../../accountDB'

export async function GET(request: NextRequest) {
    try {
        const nextUrl = new URL(request.nextUrl);
        const userId = nextUrl.searchParams.get('DriverId');
        const results = await new Promise<Array<{ id: string, OrderStatus: string }>>((resolve, reject) => {
            accountDB.query('SELECT * FROM orders WHERE DriverId = ?', [userId], (err: any, results: any[], fields: any) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("OK");
                    resolve(results);
                }
            });
        });
        console.log(results);
        const OrderStatus = results.map((result) => ( result ));
        return NextResponse.json(OrderStatus);
    } catch (error) {
        return NextResponse.json(
            { message: error },
            {
                status: 500
            }
        );
    }
}