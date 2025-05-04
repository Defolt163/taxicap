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
