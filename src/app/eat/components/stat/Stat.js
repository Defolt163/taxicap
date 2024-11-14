'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import './style.sass'
import DataTable from "../data-table/DataTable"
import AIChat from "../AI/AI"
import Orders from "../Orders/Orders"
  
export default function Stat(){
    return(
        <div className="statistics">
            <div className="general-stat">
                <Card className='general-stat_item'>
                    <CardHeader>
                        <CardTitle>Прибыль</CardTitle>
                        <CardDescription>100.000р</CardDescription>
                    </CardHeader>
                </Card>
                <Card className='general-stat_item'>
                    <CardHeader>
                        <CardTitle>Заказов</CardTitle>
                        <CardDescription>256</CardDescription>
                    </CardHeader>
                </Card>
                <Card className='general-stat_item'>
                    <CardHeader>
                        <CardTitle>Товары</CardTitle>
                        <CardDescription>12</CardDescription>
                    </CardHeader>
                </Card>
            </div>
            <div className="orders-stat">
                <DataTable/>
                <table>
                <caption>Топ 3 популярных товара:</caption> 
                    <tr>
                        <td>1</td>
                        <td>Пицца: Пепперони</td>
                        <td>35 заказов</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Пицца: Маргарита</td>
                        <td>25 заказов</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Пицца: Гавайская</td>
                        <td>15 заказов</td>
                    </tr>
                </table>
            </div>
            <AIChat/>
        </div>
    )
}