import Products from '../../components/Products/Products'
import RestaurantInfo from '../../components/restaurantComponentsForUser/restaurantInfo/restaurantInfo'
import './style.sass'
export default function restaurantPage(){
    return(
        <div className="restaurant-page">
            <div className='restaurant-block'>
                <RestaurantInfo/>
                <div className='eat-block_header'>Меню</div>
                <Products/>
            </div>
            <div className='restaurant-cart-block'>
                <div className='restaurant-cart'>
                    <div className='eat-block_header'>Корзина</div>
                    <hr/>
                    <div className='restaurant-cart_404'>
                        Корзина пуста!
                    </div>
                </div>
            </div>
        </div>
    )
}