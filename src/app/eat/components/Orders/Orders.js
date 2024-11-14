import Link from 'next/link'
import './style.sass'
export default function Orders(){
    return(
        <div className='orders-table'>
            <table>
                <tr>
                    <th>#</th>
                    <th>Статус</th>
                    <th>Гость</th>
                    <th>Номер</th>
                    <th>Товары</th>
                    <th>Кол-во</th>
                    <th>Сумма</th>
                    <th>Действие</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Готов</td>
                    <td>Михаил</td>
                    <td>89397561466</td>
                    <td>
                        <ul>
                            <li>Пицца: Пепперони</li>
                            <li>Пицца: Маргарита</li>
                            <li>Пицца: Гавайская</li>
                        </ul>
                    </td>
                    <td>3</td>
                    <td>450р</td>
                    <td><Link href={"#"}>Перейти</Link></td>
                </tr>
            </table>
        </div>
    )
}