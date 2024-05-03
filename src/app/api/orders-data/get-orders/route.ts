import { NextResponse } from "next/server"
import accountDB from '../../accountDB'

export async function GET() {
    try{
      const results = await new Promise((resolve, reject) =>{
        accountDB.query("SELECT id, CustomerPhone, CustomerName, UserId, DriverName, DriverId, DriverPhone, VehicleBrand, VehicleModel, VehicleColor, VehicleNumber, OrderStatus, LatFrom, LonFrom, LatTo, LonTo, AddressFrom, AddressTo, Price, DriverImage, CustomerImage FROM orders WHERE OrderStatus = 'created'", (err: any, results: []) =>{
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