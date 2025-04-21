import { NextRequest, NextResponse } from "next/server"
import pool from '../../accountDB'
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
const SECRET_KEY = process.env.JWT_SECRET_KEY; // Секрет для JWT

export async function PUT(req) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");
  console.log('orderId:', orderId);
  if (!token) {
      return new Response(JSON.stringify({ message: 'Tокен не предоставлен' }), { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    const { DriverName, DriverPhone, VehicleBrand, VehicleModel, VehicleColor, VehicleNumber, OrderStatus, DriverImage } = await req.json();
    
    await pool.query(
      'UPDATE orders SET DriverName = ?, DriverId = ?, DriverPhone = ?, VehicleBrand = ?, VehicleModel = ?, VehicleColor = ?, VehicleNumber = ?, OrderStatus = ?, DriverImage = ? WHERE id = ?', [DriverName, decoded.id, DriverPhone, VehicleBrand, VehicleModel, VehicleColor, VehicleNumber, OrderStatus, DriverImage, orderId]
    );
    return new Response({ status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(), { status: 401 });
  }
}