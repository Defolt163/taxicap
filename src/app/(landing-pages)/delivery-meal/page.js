'use client'
import Image from 'next/image';
import './style.sass'
import logo from '/public/logo/swift-logo.svg'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from 'next/link';
import { useEffect } from 'react';



export default function DeliveryMeal(){
    const [statIteration, setStateIteration] = useEffect(5)
    useEffect(()=>{
        fetch(`/api/stat-info`,{
            method: 'GET'
          }).then((result)=>{
              return result.json()
          }).then((res)=>{
            setStateIteration(res)
          })
    },[])
    function sendStat(){
        fetch(`/api/stat-info`,{
            method: 'GET'
          }).then((result)=>{
              return result.json()
          }).then((res)=>{

          })
    }
    return(
        <div className="delivery-meal">
            <Link href={'/'}>
                <Image className='logo-image' src={logo} alt="logo"/>
            </Link>
            <h1><strong>В данный момент, сервис в разработке😕</strong> <br/> Но мы работаем над тем, чтобы как можно быстрее его реализовать ❤️‍🩹</h1>
            <h3>А так-же, привлекаем владельцев точек питания с едой на вынос в наше приложение!</h3>
            <h3><strong>Новым партнерам, первые 26 дней - бесплатно ❤️</strong></h3>
            <Dialog>
                <DialogTrigger className='Button'>Подробнее</DialogTrigger>
                <DialogContent className='delivery-meal_dialog'>
                    <DialogHeader>
                    <DialogTitle>Инструкция для подключения к приложению</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <h2>1. Регистрация в приложении</h2>
                        <p>
                            1. Заполните форму обратной связи, и мы свяжемся с вами.
                        </p>
                        <form className='delivery-meal_form'>
                            <div className='form-user-data'>
                                <div className='form-user-data_item'>
                                    <Label htmlFor='name'>Имя</Label>
                                    <Input id='name' required/>
                                </div>
                                <div className='form-user-data_item'>
                                    <Label htmlFor='email'>Email</Label>
                                    <Input id='email' required type='email'/>
                                </div>
                            </div>
                            <Label htmlFor='businessDescription'>Описание</Label>
                            <Textarea id='businessDescription' placeholder='Краткая информация о заведении'/>
                            <div className='form-user-data'>
                                <div className='form-user-data_item'>
                                    <Label htmlFor='name'>Время работы</Label>
                                    <InputOTP maxLength={4}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                    <div className='otp-input_down'>
                                        <InputOTP maxLength={4}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                </div>
                                <div className='form-user-data_item'>
                                    <Label htmlFor='address'>Адрес</Label>
                                    <Input id='address' required type='text'/>
                                </div>
                            </div>
                            <div className='form-advanced-details'>
                                <div className='form-advanced-detail'>
                                    <Checkbox id='workType'/>
                                    <Label htmlFor='workType'>Работаете на вынос</Label>
                                </div>
                                <div className='form-advanced-detail'>
                                    <Checkbox id='delivery'/>
                                    <Label htmlFor='delivery'>Доставка</Label>
                                </div>
                            </div>
                            <h3>Тип ресторана:</h3>
                            <div className='form-advanced-details'>
                                <div className='form-advanced-detail'>
                                    <Checkbox id='fastFood'/>
                                    <Label htmlFor='fastFood'>Фаст Фуд</Label>
                                </div>
                                <div className='form-advanced-detail'>
                                    <Checkbox id='pizza'/>
                                    <Label htmlFor='pizza'>Пиццерия</Label>
                                </div>
                                <div className='form-advanced-detail'>
                                    <Checkbox id='barbecue'/>
                                    <Label htmlFor='barbecue'>Шашлычная</Label>
                                </div>
                                <div className='form-advanced-detail'>
                                    <Checkbox id='suchi'/>
                                    <Label htmlFor='suchi'>Японская кухня</Label>
                                </div>
                            </div>
                            <button>Submit</button>
                        </form>
                        <h2>2. Подписание договора</h2>
                        <p>После регистрации с вами свяжется наш менеджер для подписания партнёрского соглашения.
                        Оплата производится один раз в месяц, без скрытых комиссий или дополнительных платежей.</p>
                        <h2>
                            3. Добавление продукции
                        </h2>
                        <h3>Чтобы добавить вашу продукцию в приложение, выполните следующие шаги:</h3>
                        <h3>Шаг 1: Создание каталога продукции</h3>
                        <p>Сделайте фото вашей продукции. Изображения должны быть качественными, в хорошем освещении. Убедитесь, что каждый товар представлен четко и привлекательно.</p>
                        <h3>Шаг 2: Описание продукции</h3>
                        <p>Укажите название блюда.</p>
                        <p>Описание должно включать:</p>
                        <ul>
                            <li>Состав блюда (перечень продуктов).</li>
                            <li>Калорийность на порцию.</li>
                            <li>Информацию о возможных аллергенах (например, содержит молоко, орехи и т.д.).</li>
                            <li>Возможные варианты подачи (например, добавить сыр, без глютена и т.д.).</li>
                        </ul>
                        <h3>Шаг 3: Указание цены</h3>
                        <p>Установите цену за каждую единицу продукции.<br/>
                        При необходимости добавьте различные ценовые категории (например, стандартная порция, большая порция).</p>
                        <h3>Шаг 4: Уточнение времени готовности</h3>
                        <p>Укажите время, необходимое для приготовления каждого блюда.</p>
                        <h2>4. Проверка и запуск</h2>
                        <p>После добавления всех товаров и заполнения информации, ваш каталог будет проверен нашей командой на соответствие стандартам.<br/>
                        После одобрения ваша точка станет доступна пользователям для заказа через наше приложение.</p>
                        <h2>5. Управление заказами</h2>
                        <p>Вы сможете отслеживать заказы в реальном времени. Все новые заказы приходят в специальный чат бот Telegram<br/>
                        Каждое подтверждение заказа будет сопровождаться уведомлением для удобного управления доставками и самовывозом. Вам необходимо будет вовремя менять статус заказа: "Принят", "Готовится", "Готов". По типу заказа: "Ожидает" или "В доставке"</p>
                        <h2>6. Ежемесячная оплата</h2>
                        <p>Платежи за использование платформы производятся один раз в месяц. Вы получите счёт с подробным отчётом за прошедший период. <br/>
                        <strong>Новым партнерам, первые 26 дней - бесплатно</strong>
                        </p>
                        <h2>Важные моменты:</h2>
                        <ul>
                            <li>Обновляйте фото и описание продукции по мере необходимости, чтобы пользователи всегда видели актуальную информацию.</li>
                            <li>Постарайтесь предлагать пользователям уникальные предложения, чтобы привлечь больше клиентов.</li>
                            <li>Поддерживайте постоянную обратную связь с клиентами через приложение.</li>
                            <li>Приложение - способ оформления заказа. В данный момент, <strong>приложение не доставляет заказы</strong>. Это означает, что вы сами, при случае заказа на адрес, доставляете продукцию</li>
                        </ul>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
            <Link href={'/'} style={{marginTop: '10px'}} className='Button'>На главную</Link>
            <div className='social-survey'>
                <h3>Соц опрос:</h3>
                <h4>Вы бы хотели иметь возможность заказа еды через приложение?</h4>
                <RadioGroup className='radio-group' defaultValue="option-one">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem className='radio-group-indicator' value="option-one" id="option-one" />
                        <Label htmlFor="option-one">Да</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem className='radio-group-indicator' value="option-two" id="option-two" />
                        <Label htmlFor="option-two">Нет</Label>
                    </div>
                </RadioGroup>
                <h5><strong>{'5'}</strong> человек воспользовались бы такой возможностью</h5>
                <div className='Button'>Ответить</div>
            </div>
            <div class="delivery-meal__gradient"></div>
        </div>
    )
}