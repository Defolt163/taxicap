import { NextResponse, NextRequest } from "next/server"
import accountDB from '../../../accountDB'

export async function GET(request: NextRequest) {
    try{
        const nextUrl = new URL(request.nextUrl);
        const orderId = nextUrl.searchParams.get('orderId');
        const results = await new Promise((resolve, reject) =>{
            accountDB.query(`SELECT * FROM orders WHERE id = ${orderId}`, (err: any, results: []) =>{
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