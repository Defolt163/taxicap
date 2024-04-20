import { NextRequest, NextResponse } from "next/server"
import db from '../../accountDB'

export async function PUT(request: NextRequest) {
  try {
    if (request.method === 'PUT') {
      const url = new URL(request.url);
      const params = new URLSearchParams(url.search);
      const orderId = params.get('id');

      if (!orderId) {
        return NextResponse.json({ message: "Invalid order id" }, { status: 400 });
      }

      const { DriverName, DriverId, DriverPhone, VehicleBrand, VehicleModel, VehicleColor, VehicleNumber, OrderStatus } = await request.json();

      const result: any = await new Promise((resolve, reject) => {

        db.query(
            "UPDATE orders SET DriverName = ?, DriverId = ?, DriverPhone = ?, VehicleBrand = ?, VehicleModel = ?, VehicleColor = ?, VehicleNumber = ?, OrderStatus = ? WHERE id = ?",
            [DriverName, DriverId, DriverPhone, VehicleBrand, VehicleModel, VehicleColor, VehicleNumber, OrderStatus, orderId],
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
        return NextResponse.json({ message: "User updated successfully" });
      } else {
        return NextResponse.json({ message: "Failed to update user" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: "Invalid method" }, { status: 405 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}