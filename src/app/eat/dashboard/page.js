
'use client'
import { useState } from 'react'
import Orders from '../components/Orders/Orders'
import Products from '../components/Products/Products'
import Sidebar from '../components/sidebar/Sidebar'
import Stat from '../components/stat/Stat'
import './style.sass'
export default function DashboardPage(){
    const [currentPage, setCurrentPage] = useState('stat')

    const renderContent = () => {
        switch (currentPage) {
            case 'stat':
                return <Stat />;
            case 'products':
                return <Products />;
            case 'orders':
            default:
                return <Orders />;
        }
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-page_wrapper">
                <Sidebar setCurrentPage={setCurrentPage} />
                {renderContent()}
            </div>
        </div>
    );
}