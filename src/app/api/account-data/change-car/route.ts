import { NextRequest, NextResponse } from "next/server";
import db from "../../accountDB";

export async function PUT(request: NextRequest) {
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
