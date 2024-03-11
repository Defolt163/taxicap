import { NextRequest, NextResponse } from "next/server"
import accountDB from '../../accountDB'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, inputName, inputEmail, inputPassword } = await request.json();

    const result: any = await new Promise((resolve, reject) => {
        accountDB.query(
        "INSERT INTO accounts (UserSessionId, UserName, UserEmail, UserPassword) VALUES (?, ?, ?, ?)",
        [sessionId, inputName, inputEmail, inputPassword],
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
      return NextResponse.json({ message: "User created successfully" });
    } else {
      return NextResponse.json(
        { message: "Failed to create user" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}