import { NextRequest, NextResponse } from "next/server"
import accountDB from '../accountDB'

export async function GET() {
    try{
      const results = await new Promise((resolve, reject) =>{
        accountDB.query("SELECT * FROM eatstats", (err: any, results: []) =>{
          if(err){
            reject(err)
          } else{
            resolve(results)
          }
        })
      })
      console.log(results)
      return NextResponse.json(results)
    } catch (error){
      return NextResponse.json(
        {message: error},
        {
          status: 500
        }
      )
    }
}

export async function POST(request: NextRequest) {
    try {
      const {
        id,
        clickCounts
      } = await request.json();
  
      const values = [
        id,
        clickCounts
      ];
  
      const result: any = await new Promise((resolve, reject) => {
        accountDB.query(
          "INSERT INTO orders () VALUES (?, ?)",
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
        return NextResponse.json({ message: "Order(s) created successfully" });
      } else {
        return NextResponse.json({ message: "Failed to create order(s)" }, { status: 400 });
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
  