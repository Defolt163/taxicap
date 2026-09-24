export default function PopupConfirm({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;
    
    return (
        <div>
            <div className="popup-background popup-open"></div>
            <div className="popup popup-confirm">
                <h3 className="popup-confirm__title">{title}</h3>
                <p className="popup-confirm__message">{message}</p>
                <div className="popup-confirm__buttons">
                    <button 
                        className="Button PopupButton popup-confirm__cancel" 
                        onClick={onCancel}
                    >
                        Отмена
                    </button>
                    <button 
                        className="Button PopupButton popup-confirm__confirm" 
                        onClick={onConfirm}
                    >
                        Подтвердить
                    </button>
                </div>
            </div>
        </div>
    );
}