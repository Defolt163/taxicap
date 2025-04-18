import { NextRequest, NextResponse } from "next/server";
import pool from "../../accountDB";

import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY; // Секрет для JWT

export async function deleteVehicle(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        pool.query(
          'UPDATE accounts SET VehicleBrand = NULL, VehicleModel = NULL, VehicleColor = NULL, VehicleNumber = NULL WHERE UserId = ?', [decoded.id]
        );

    } catch (err) {
        console.error('Ошибка на сервере:', err);
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
        return new Response(JSON.stringify({ message: 'Tокен не предоставлен' }), { status: 401 });
    }
    try {
        await deleteVehicle(token);
        return new Response({ status: 200 });
    } catch (error) {
        console.error('Ошибка при получении пользователя:', error.message);
        return new Response(JSON.stringify(), { status: 401 });
    }
}

export async function PUT(req) {
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
        console.log('Токен не предоставлен');
        return new Response(JSON.stringify({ message: 'Tокен не предоставлен' }), { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const { VehicleBrand, VehicleModel, VehicleColor, VehicleNumber } = await req.json();
      pool.query(
        'UPDATE accounts SET VehicleBrand = ?, VehicleModel = ?, VehicleColor = ?, VehicleNumber = ? WHERE UserId = ?', [VehicleBrand, VehicleModel, VehicleColor, VehicleNumber, decoded.id]
      );
        return new Response({ status: 200 });
    } catch (error) {
        console.error('Ошибка при получении пользователя:', error.message);
        return new Response(JSON.stringify(), { status: 401 });
    }
}


/* export async function PUT(request: NextRequest) {
  try {
    if (request.method === "PUT") {
      const url = new URL(request.url);
      const params = new URLSearchParams(url.search);
      const sessionId = params.get("sessionId");

      if (!sessionId) {
        return NextResponse.json(
          { message: "Invalid UserSessionId" },
          { status: 400 }
        );
      }

      const { VehicleBrand, VehicleModel, VehicleColor, VehicleNumber } =
        await request.json();

      let query = "UPDATE accounts SET ";
      let queryParams: any[] = [];
      let updateParams: any[] = [];

      if (VehicleBrand) {
        query += "VehicleBrand = ?, ";
        updateParams.push(VehicleBrand);
      }

      if (VehicleModel) {
        query += "VehicleModel = ?, ";
        updateParams.push(VehicleModel);
      }

      if (VehicleColor) {
        query += "VehicleColor = ?, ";
        updateParams.push(VehicleColor);
      }

      if (VehicleNumber) {
        query += "VehicleNumber = ?, ";
        updateParams.push(VehicleNumber);
      }

      query = query.slice(0, -2); // Удалить последнюю запятую и пробел
      query += " WHERE UserSessionId = ?";
      updateParams.push(sessionId);

      const result: any = await new Promise((resolve, reject) => {
        db.query(query, updateParams, (err: any, results: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      if (result && result.affectedRows === 1) {
        return NextResponse.json({ message: "User updated successfully" });
      } else {
        return NextResponse.json(
          { message: "Failed to update user" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json({ message: "Invalid method" }, { status: 405 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
 */