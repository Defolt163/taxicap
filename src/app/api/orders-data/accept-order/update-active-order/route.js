import { NextRequest, NextResponse } from "next/server"
import pool from '../../../accountDB'
import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET_KEY; // Секрет для JWT

export async function PUT(req) {
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
      return new Response(JSON.stringify({ message: 'Tокен не предоставлен' }), { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    const { ActiveOrder } = await await req.json();
    await pool.query(
      'UPDATE accounts SET ActiveOrder = ? WHERE UserId = ?', [ActiveOrder, decoded.id]
    );
    return new Response({ status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(), { status: 401 });
  }
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const activeOrderId = searchParams.get("id");
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
        console.log('Токен не предоставлен');
        return new Response(JSON.stringify({ message: 'Tокен не предоставлен' }), { status: 401 });
    }
    try {
        //const decoded = jwt.verify(token, SECRET_KEY);
        const [order] = await pool.query(`SELECT * FROM orders WHERE id = ?`, [activeOrderId]);
        
        console.log(order);
        return new Response(
          JSON.stringify( order ),
          { status: 200 }
        );   
    } catch (error) {
        return NextResponse.json(
            { message: error },
            {
                status: 500
            }
        );
    }
}