import { NextRequest, NextResponse } from "next/server";
import accountDB from "../../accountDB";
const SECRET_KEY = process.env.JWT_SECRET_KEY; // Секрет для JWT
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const inputEmail = searchParams.get("inputEmail");
  try {
    if (!inputEmail) {
      return NextResponse.json({ message: "Email не указан" }, { status: 400 });
    }

    const [rows] = await accountDB.query(
      "SELECT UserEmail FROM accounts WHERE UserEmail = ?",
      [inputEmail]
    );
    if (rows.length > 0) {
      return new Response(JSON.stringify(), { status: 200 });
    }

    return new Response(JSON.stringify(), { status: 404 });

  } catch (error) {
    console.error("Ошибка при проверке email:", error);
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
