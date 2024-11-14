'use client'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { useState } from "react"
import './style.sass'
  
export default function ProductFormAdd(){
    const [files, setFiles] = useState([])
    const [imagesNames, setImagesNames] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // Inputs
    const [restaurantId, SetRestaurantId] = useState(0)
    const [productName,setProductName] = useState('')
    const [productDescr,setProductDescr] = useState('')
    const [productWeight,setProductWeight] = useState('')
    const [productPrice,setProductPrice] = useState('')
    const [productMainImage,setProductMainImage] = useState('')
    const [productSecondImage,setProductSecondImage] = useState('')
    const [productKkal,setProductKkal] = useState('')
    const [productProtein,setProductProtein] = useState('')
    const [prdouctFat,setPrdouctFat] = useState('')
    const [productCarb,setProductCarb] = useState('')
    const [fileImage, setFileImage] = useState(null)

    const handleMainImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('mainImage', file);
            // Загрузите основной файл
            await uploadFile(formData);
        }
    };
    
    const uploadFile = async (formData) => {
    try {
        const response = await fetch('http://192.168.0.110:3002/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Main Images:', data.mainImages);
        } else {
            console.error('Ошибка загрузки файлов');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
};
 

    async function createProduct(e){
        e.preventDefault();
        const formData = new FormData();

        if (fileImage) {
            formData.append('mainImage', fileImage);
        }

        try {
            const response = await fetch('http://192.168.0.110:3002/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Main Images:', data.mainImages);
                await fetch(`/api/swift-eat/products/create-product`,{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        "RestaurantId": 1,
                        "ProductName": productName,
                        "ProductDescr":productDescr,
                        "ProductWeight": productWeight,
                        "ProductPrice": productPrice,
                        "ProductMainImage": `/public/swiftEat/${data.mainImages}`,
                        "ProductSecondImage": productSecondImage,
                        "ProductKkal": productKkal,
                        "ProductProtein": productProtein,
                        "PrdouctFat": prdouctFat,
                        "ProductCarb": productCarb
                    }),
                }).then(
                    console.log("Добавлено")
                ).catch((error)=>{
                    console.error("Ошибка", error)
                })
            } else {
                console.error('Ошибка загрузки файлов');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }

        /* fetch(`/api/swift-eat/products/create-product`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                "RestaurantId": 1,
                "ProductName": productName,
                "ProductDescr":productDescr,
                "ProductWeight": productWeight,
                "ProductPrice": productPrice,
                "ProductMainImage": productMainImage,
                "ProductSecondImage": productSecondImage,
                "ProductKkal": productKkal,
                "ProductProtein": productProtein,
                "PrdouctFat": prdouctFat,
                "ProductCarb": productCarb
            }),
        }).then(
            console.log("Добавлено")
        ).catch((error)=>{
            console.error("Ошибка", error)
        }) */
    }

    return(
        <div className="product-add_form">
            <h1>Добавление товара</h1>
            <form onSubmit={(e)=>{createProduct(e)}} className="product-add_form-block">
                <div className="product-add_form-block_input">
                    <div className="product-add_form-item">
                        <Label htmlFor="ProductName">Наименование *</Label>
                        <Input id="ProductName" required value={productName} onChange={(e)=>{setProductName(e.target.value)}}/>
                    </div>
                    <div className="product-add_form-item">
                        <Label htmlFor="ProductDescr">Состав (Через запятую)*</Label>
                        <Input id="ProductDescr" required value={productDescr} onChange={(e)=>{setProductDescr(e.target.value)}}/>
                    </div>
                    <div className="product-add_form-item">
                        <Label htmlFor="ProductDescr">Вес*</Label>
                        <Input id="ProductDescr" required value={productWeight} onChange={(e)=>{setProductWeight(e.target.value)}}/>
                    </div>
                    <div className="advanced-product-descr">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Дополнительно:</AccordionTrigger>
                                <AccordionContent>
                                    <div className="product-add_form-item">
                                        <Label htmlFor="Kkal">Калорийность (на 100г)</Label>
                                        <Input id="Kkal" />
                                    </div>
                                    <div className="product-add_form-item">
                                        <Label htmlFor="protein">Белки (на 100г)</Label>
                                        <Input id="protein" />
                                    </div>
                                    <div className="product-add_form-item">
                                        <Label htmlFor="fats">Жиры (на 100г)</Label>
                                        <Input id="fats" />
                                    </div>
                                    <div className="product-add_form-item">
                                        <Label htmlFor="carbohydrates">Углеводы (на 100г)</Label>
                                        <Input id="carbohydrates" />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                    <div className="product-add_form-item">
                        <Label htmlFor="ProductPrice">Цена*</Label>
                        <Input id="ProductPrice" required value={productPrice} onChange={(e)=>{setProductPrice(e.target.value)}}/>
                    </div>
                    <button className="Button">Добавить</button>
                </div>
                <div className="product-add_form-block_input">
                    <Label htmlFor="mainImage">Главное изображение</Label>
                    <Input
                        id="mainImage"
                        name="mainImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFileImage(e.target.files[0])}
                        required
                    />
                </div>
            </form>
        </div>
    )
}