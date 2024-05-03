import { NextRequest, NextResponse } from "next/server"
import db from '../../accountDB'

export async function PUT(request: NextRequest) {
  try {
    if (request.method === 'PUT') {
      const url = new URL(request.url);
      const params = new URLSearchParams(url.search);
      const userId = params.get('UserId');

      if (!userId) {
        return NextResponse.json({ message: "Invalid UserEmail" }, { status: 400 });
      }

      const { UserName, UserPhone, UserEmail } = await request.json();

      // Получение текущих значений из базы данных
      const currentUserData: any = await new Promise((resolve, reject) => {
        db.query(
          "SELECT UserName, UserPhone, UserEmail FROM accounts WHERE UserId = ?",
          [userId],
          (err: any, results: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(results[0]);
            }
          }
        );
      });

      // Если какое-либо из значений пустое, используем текущие значения из базы данных
      const updatedUserName = UserName || currentUserData.UserName;
      const updatedUserPhone = UserPhone || currentUserData.UserPhone;
      const updatedUserEmail = UserEmail || currentUserData.UserEmail;

      const result: any = await new Promise((resolve, reject) => {
        db.query(
          "UPDATE accounts SET UserName = ?, UserPhone = ?, UserEmail = ? WHERE UserId = ?",
          [updatedUserName, updatedUserPhone, updatedUserEmail, userId],
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
        return NextResponse.json({ message: "Редактирование выполнено" });
      } else {
        return NextResponse.json({ message: "Ошибка редактирования" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: "Invalid method" }, { status: 405 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
