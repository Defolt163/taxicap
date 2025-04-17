import { NextRequest, NextResponse } from "next/server";
import accountDB from "../../accountDB";
const SECRET_KEY = process.env.JWT_SECRET_KEY; // Секрет для JWT
export async function GET(request) {
  try {
    const inputEmail = request.nextUrl.searchParams.get("inputEmail");
    if (!inputEmail) {
      return NextResponse.json({ message: "Email не указан" }, { status: 400 });
    }

    const [rows] = await accountDB.query(
      "SELECT UserEmail FROM accounts WHERE UserEmail = ?",
      [inputEmail]
    );
    if (rows.length > 0) {
      return NextResponse.json(
        { message: "Пользователь уже существует", exists: true },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Email свободен", exists: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при проверке email:", error);
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
