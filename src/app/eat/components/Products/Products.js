'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import ProductFormAdd from '../ProductFormAdd/ProductFormAdd'
import './style.sass'
import { useEffect, useState } from "react"
export default function Products(){

    const[step, setStep] = useState(0)
    function handleNextStep(){
        setStep(step + 1)
    }

    const handlePrevStep = () => {
        setStep(step - 1)
    }

    const [products, setProducts] = useState([])
    useEffect(()=>{
        fetch(`/api/swift-eat/products/get-products?UserId=1`)
        .then((result)=>{
            return result.json()
        }).then((res)=>{
            setProducts(res)
        }).catch(
            console.error("Ошибка")
        )
    },[])
    const renderContent = () => {
        switch (step) {
            case 0:
                return(
                    <>
                        <div className="products-block">
                            <Card onClick={()=>{handleNextStep()}} className='product-cart_item product-cart_add-item'>
                                <CardHeader className="product-cart_plus">
                                    +
                                </CardHeader>
                            </Card>
                            {products.map((productItem)=>(
                                <Card key={productItem.ProductId} className='product-cart_item'>
                                    <CardHeader>
                                        <div className="product-image" style={{background: `url('https://i.pinimg.com/originals/04/cf/fd/04cffd7fd60d1933d41ee534ebfb8ff6.jpg') center center/cover no-repeat`}}></div>
                                        <CardTitle>{productItem.ProductName}</CardTitle>
                                        <CardDescription>{productItem.ProductWeight}г</CardDescription>
                                        <CardTitle>{productItem.ProductPrice} руб</CardTitle>
                                    </CardHeader>
                                    <div className="Button">Изменить</div>
                                </Card>
                            ))}
                        </div>
                    </>
                )
            case 1:
                return(
                    <>
                        <ProductFormAdd/>
                    </>
                )
            case 2:
                return{
                    
                }
        }
    }
    return(
        <>{renderContent()}</>
    )
}