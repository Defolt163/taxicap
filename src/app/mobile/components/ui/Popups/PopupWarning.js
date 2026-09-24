import Link from "next/link"

export default function popupWarning({isOpen, text, action}){
    if (!isOpen) return null
    
    return(
        <div>
            <div className={`popup-background popup-open`}></div>
            <div className={`popup popup-input-error`}>
                <h3 className='popup-input-error__text'>{text}</h3>
                <Link className='Button PopupButton' href={action.href} >{action.text}</Link>
            </div>
            <div className={`popup-background popup-open`}></div>
        </div>
    )
}
