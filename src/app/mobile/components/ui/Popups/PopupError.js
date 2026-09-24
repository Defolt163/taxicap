import Link from "next/link"

export default function PopupError({isOpen, text, action}){
    if (!isOpen) return null
    console.log('Повторяем действие');
    return(
        <div>
            <div className={`popup-background popup-open`}></div>
            <div className={`popup popup-input-error`}>
                <h3 className='popup-input-error__text'>{text}</h3>
                <div className='Button PopupButton'>{action.text}</div>
            </div>
            <div className={`popup-background popup-open`}></div>
        </div>
    )
}
