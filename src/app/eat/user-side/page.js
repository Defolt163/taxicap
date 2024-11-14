import EatPromo from '../components/EatPromo/EatPromo'
import EatRestaurants from '../components/EatRestaurants/EatRestaurants'
export default function userSide(){
    return(
        <div className="eatPage">
            <EatPromo/>
            <EatRestaurants/>
        </div>
    )
}