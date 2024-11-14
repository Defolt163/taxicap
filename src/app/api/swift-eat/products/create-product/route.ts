import { NextRequest, NextResponse } from "next/server";
import accountDB from '../../../accountDB';

export async function POST(request: NextRequest) {
  try {
    const {
        RestaurantId,
        ProductName,
        ProductDescr,
        ProductWeight,
        ProductPrice,
        ProductMainImage,
        ProductSecondImage,
        ProductKkal,
        ProductProtein,
        PrdouctFat,
        ProductCarb
    } = await request.json();

    const values = [
        RestaurantId,
        ProductName,
        ProductDescr,
        ProductWeight,
        ProductPrice,
        ProductMainImage,
        ProductSecondImage,
        ProductKkal,
        ProductProtein,
        PrdouctFat,
        ProductCarb
    ];

    const result: any = await new Promise((resolve, reject) => {
      accountDB.query(
        "INSERT INTO eatProducts (RestaurantId, ProductName, ProductDescr, ProductWeight, ProductPrice, ProductMainImage, ProductSecondImage, ProductKkal, ProductProtein, PrdouctFat, ProductCarb) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        values,
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
      return NextResponse.json({ message: "Product created successfully" });
    } else {
      return NextResponse.json({ message: "Failed to create product" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

