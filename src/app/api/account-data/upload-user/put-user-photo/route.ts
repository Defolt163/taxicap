import { NextRequest, NextResponse } from "next/server"
import db from '../../../accountDB'

export async function PUT(request: NextRequest) {
  try {
    if (request.method === 'PUT') {
      const url = new URL(request.url);
      const params = new URLSearchParams(url.search);
      const userId = params.get('UserId');

      if (!userId) {
        return NextResponse.json({ message: "Invalid UserId" }, { status: 400 });
      }

      const { UserImage } = await request.json();

      const result: any = await new Promise((resolve, reject) => {

        db.query(
            "UPDATE accounts SET UserImage = ? WHERE UserId = ?",
            [UserImage, userId],
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
        return NextResponse.json({ message: "Фото обновлено" });
      } else {
        return NextResponse.json({ message: "Ошибка обновления фото" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: "Invalid method" }, { status: 405 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}