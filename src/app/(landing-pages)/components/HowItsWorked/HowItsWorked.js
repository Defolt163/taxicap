import './style.sass'
export default function HowItsWorked(){
    return(
        <div className="landing_howitwork" id='workis'>
            <div className='landing_howitwork_wrapper'>
                <h2 className='landing_page_subheader'>Как это работает</h2>
                <h3 className='landing_page_header'>Всего 3 шага до поездки</h3>
                <div className="parts">
                    <div className="part_item">
                        <div className='part_item_number'>1</div>
                        <div>
                            <h2>Куда едем?</h2>
                            <h3>Выбери откуда и куда едем</h3>
                        </div>
                    </div>
                    <div className="part_item">
                        <div className='part_item_number'>2</div>
                        <div>
                            <h2>Условия поездки</h2>
                            <h3>Выбери подходящий вариант расчёта</h3>
                        </div>
                    </div>
                    <div className="part_item">
                        <div className='part_item_number'>3</div>
                        <div>
                            <h2>Ищем водителя</h2>
                            <h3>Приложение покажет ваш заказ свободным водителям</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}