import './style.sass'
export default function DataTable(){
    return(
        <div className='data-table'>
            <table>
            <caption>Последние заказы</caption> 
                <tr>
                    <th>№</th>
                    <th>Статус</th>
                    <th>Гость</th>
                    <th>Телефон</th>
                    <th>Кол-во</th>
                    <th>Стоимость</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Готов</td>
                    <td>Михаил</td>
                    <td>89397561466</td>
                    <td>3</td>
                    <td>450р</td>
                </tr>
            </table>
        </div>
    )
}