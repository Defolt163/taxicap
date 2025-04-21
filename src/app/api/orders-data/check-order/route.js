import { NextRequest, NextResponse } from "next/server"
import pool from '../../accountDB'
import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET_KEY; // Секрет для JWT


export async function GET(req) {
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
      console.log('Токен не предоставлен');
      return new Response(JSON.stringify({ message: 'Tокен не предоставлен' }), { status: 401 });
  }
  try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const [order] = await pool.query(`SELECT * FROM orders WHERE UserId = 1 AND (OrderStatus = "created" OR OrderStatus = "active")`, [decoded.id]);
      //;
      // SELECT id, OrderStatus, Date FROM orders WHERE UserId = ? AND OrderStatus = "completed"
      
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









/* export async function GET(request: NextRequest) {
    try {
        const nextUrl = new URL(request.nextUrl);
        const userId = nextUrl.searchParams.get('userId');
        const results = await new Promise<Array<{ id: string, OrderStatus: string, Date: string }>>((resolve, reject) => {
            accountDB.query(`SELECT id, OrderStatus, Date FROM orders WHERE UserId = '${userId}'`, (err: any, results: Array<{ id: string, OrderStatus: string, Date: string }>) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("OK");
                    resolve(results);
                }
            });
        });
        console.log(results);
        const OrderStatus = results.map((result) => ({ id: result.id, OrderStatus: result.OrderStatus, date: result.Date }));
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

export async function DELETE(request: NextRequest) {
    try {
      const nextUrl = new URL(request.nextUrl);
      const orderId = nextUrl.searchParams.get("orderId");
  
      await new Promise<void>((resolve, reject) => {
        accountDB.query(
          `DELETE FROM orders WHERE id = '${orderId}'`,
          (err: any) => {
            if (err) {
              reject(err);
            } else {
              console.log("OK");
              resolve();
            }
          }
        );
      });
  
      return NextResponse.json({ message: "Element deleted successfully" });
    } catch (error) {
      return NextResponse.json(
        { message: error },
        {
          status: 500
        }
      );
    }
  } */