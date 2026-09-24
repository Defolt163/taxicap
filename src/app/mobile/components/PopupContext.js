'use client';
import { createContext, useContext, useState } from 'react';

const PopupContext = createContext();

export function PopupProvider({ children }) {
    const [popup, setPopup] = useState({
        isOpen: false,
        errorText: '',
        action: null
    });

    const showPopup = (errorText, action) => {
        setPopup({ isOpen: true, errorText, action });
    };

    const hidePopup = () => {
        setPopup({ isOpen: false, errorText: '', action: null });
    };

    const showChoicePopup = (errorText, actions, type = 'default') => {
        setPopup({
            isOpen: true,
            errorText: errorText,
            actions: actions,
            type: type
        });
    };

    return (
        <PopupContext.Provider value={{ popup, showPopup, hidePopup, showChoicePopup }}>
        {children}
        </PopupContext.Provider>
    );
    }

    export function usePopup() {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within PopupProvider');
    }
    return context;
}