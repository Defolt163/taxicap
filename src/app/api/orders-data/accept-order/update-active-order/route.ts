import { NextRequest, NextResponse } from "next/server"
import db from '../../../accountDB'

export async function PUT(request: NextRequest) {
  try {
    if (request.method === 'PUT') {
      const url = new URL(request.url);
      const params = new URLSearchParams(url.search);
      const userId = params.get('UserId');

      if (!userId) {
        return NextResponse.json({ message: "Invalid UserEmail" }, { status: 400 });
      }

      const { ActiveOrder } = await request.json();

      const result: any = await new Promise((resolve, reject) => {

        db.query(
            "UPDATE accounts SET ActiveOrder = ? WHERE UserId = ?",
            [ActiveOrder, userId],
            (err: any, results: any) => {
                if (err) {
                reject(err);
                } else {
                resolve(results);
                }
            }
        );
      });

      if (result && result.affectedRows === 1) {
        return NextResponse.json({ message: "Заказ добавлен в аккаунт" });
      } else {
        return NextResponse.json({ message: "Ошибка добавления заказа" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: "Invalid method" }, { status: 405 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const params = new URLSearchParams(url.search);
        const ActiveOrderId = params.get('id');
        const result: any = await new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM orders WHERE id = ?",
                [ActiveOrderId],
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