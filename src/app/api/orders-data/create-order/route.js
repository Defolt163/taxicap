/* import { NextRequest, NextResponse } from "next/server";
import accountDB from '../../accountDB';

type Order = {
  CustomerPhone: number;
  UserId: number;
  OrderStatus: string;
  CustomerName: string;
  LatFrom: number;
  LonFrom: number;
  LatTo: number;
  LonTo: number;
  Price: number
};

export async function POST(request: NextRequest) {
  try {
    const orders: Order[] = await request.json();

    const result: any = await new Promise((resolve, reject) => {
      const values: any[] = orders.map((order: Order) => [
        order.CustomerPhone,
        order.UserId,
        order.OrderStatus,
        order.CustomerName,
        order.LatFrom,
        order.LonFrom,
        order.LatTo,
        order.LonTo,
        order.Price
      ]);

      accountDB.query(
        "INSERT INTO orders (CustomerPhone, UserId, OrderStatus, CustomerName, LatFrom, LonFrom, LatTo, LonTo, Price) VALUES ?",
        [values],
        (err: any, results: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (result && result.affectedRows > 0) {
      return NextResponse.json({ message: "Order(s) created successfully" });
    } else {
      return NextResponse.json({ message: "Failed to create order(s)" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
 */

import { NextRequest, NextResponse } from "next/server";
import pool from '../../accountDB';
import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET_KEY; // Секрет для JWT

export async function POST(req) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return new Response(JSON.stringify({ message: 'Tокен не предоставлен' }), { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    const {
      CustomerPhone,
      OrderStatus,
      CustomerName,
      LatFrom,
      LonFrom,
      LatTo,
      LonTo,
      AddressFrom,
      AddressTo,
      Price,
      PaymentMethod,
      CustomerImage
    } = await req.json();

    const sql = `INSERT INTO orders (CustomerPhone, UserId, OrderStatus, CustomerName, LatFrom, LonFrom, LatTo, LonTo, AddressFrom, AddressTo, Price, PaymentMethod, CustomerImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    CustomerPhone, decoded.id, OrderStatus, CustomerName,
    LatFrom, LonFrom, LatTo, LonTo, AddressFrom, AddressTo,
    Price, PaymentMethod, CustomerImage
  ];

  await pool.query(sql, values);
    return new Response(
      { status: 200 }
    );  
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

