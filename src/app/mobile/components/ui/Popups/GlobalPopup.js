'use client';
import Link from 'next/link';
import { usePopup } from '../../PopupContext';

export default function GlobalPopup() {
    const { popup, hidePopup } = usePopup();

    if (!popup.isOpen) return null;
    console.log(popup);
    
    return (
        <div>
            <div className="popup-background popup-open" onClick={hidePopup}></div>
            <div className={`popup popup-input-error popup-open ${popup.type || 'default'}`}>
                <h3 className="popup-input-error__text">{popup.errorText}</h3>
                
                {/* Одиночное действие */}
                {popup.action && !popup.actions && (
                    popup.action.href ? (
                        <Link href={popup.action.href} className="Button PopupButton" onClick={hidePopup}>
                            {popup.action.text}
                        </Link>
                    ) : (
                        <button className="Button PopupButton" onClick={() => {
                            popup.action.onClick?.();
                            hidePopup();
                        }}>
                            {popup.action.text}
                        </button>
                    )
                )}
                
                {/* Несколько действий (выбор) */}
                {popup.actions && popup.actions.length > 0 && (
                    <div className="popup-actions">
                        {popup.actions.map((action, index) => (
                            action.href ? (
                                <Link 
                                    key={index}
                                    href={action.href} 
                                    className={`Button PopupButton ${action.className || ''}`}
                                    onClick={hidePopup}
                                >
                                    {action.text}
                                </Link>
                            ) : (
                                <button 
                                    key={index}
                                    className={`Button mt-2 ${action.className || ''}`}
                                    onClick={() => {
                                        action.onClick?.();
                                        if (!action.keepOpen) hidePopup();
                                    }}
                                >
                                    {action.text}
                                </button>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}