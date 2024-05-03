import { NextRequest, NextResponse } from "next/server"
import accountDB from '../../accountDB'

export async function GET(request: NextRequest) {
    try {
        const nextUrl = new URL(request.nextUrl);
        const sessionId = nextUrl.searchParams.get('sessionId');
        const results = await new Promise<Array<{ UserId: string, ActiveOrder: string, DriverMode: string, UserName: string, UserPhone: string, UserEmail: string, UserImage: string, VehicleBrand: string, VehicleModel: string, VehicleColor: string, VehicleNumber: string, }>>((resolve, reject) => {
            accountDB.query(`SELECT UserId, ActiveOrder, DriverMode, UserName, UserPhone, UserEmail, UserImage, VehicleBrand, VehicleModel, VehicleColor, VehicleNumber FROM accounts WHERE UserSessionId = '${sessionId}'`, (err: any, results: Array<
                {   UserId: string,
                    ActiveOrder: string,
                    DriverMode: string, 
                    UserName: string,
                    UserPhone: string,
                    UserEmail: string,
                    UserImage: string,
                    VehicleBrand: string,
                    VehicleModel: string,
                    VehicleColor: string,
                    VehicleNumber: string,
                }
                >) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("OK");
                    resolve(results);
                }
            });
        });
        console.log(results);
        const userEmails = results.map((result) => result);
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