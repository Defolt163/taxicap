import './style.sass'
export default function Sidebar({ setCurrentPage }){
    const sidebarItemStatus = "helo"
    return(
        <div className="sidebar">
            <h2 className='sidebar-logo'>SwiftTransport</h2>
            <div className='sidebar-item_block'>
                <div onClick={() => setCurrentPage('stat')} className={`sidebar-item ${sidebarItemStatus}`}>Статистика<div>{">"}</div></div>
                <div onClick={() => setCurrentPage('products')} className={`sidebar-item ${sidebarItemStatus}`}>Товары<div>{">"}</div></div>
                <div onClick={() => setCurrentPage('orders')} className={`sidebar-item ${sidebarItemStatus}`}>Заказы<div>{">"}</div></div>
                <div onClick={() => setCurrentPage('settings')} className={`sidebar-item ${sidebarItemStatus}`}>Настройки<div>{">"}</div></div>
            </div>
        </div>
    )
}