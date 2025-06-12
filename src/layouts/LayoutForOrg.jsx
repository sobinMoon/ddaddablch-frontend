import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

export default function LayoutForOrg() {
    return (
        <>
            <div className='org-navbar'
                style={{
                    backgroundColor: '#fff',
                    borderBottom: '1px solid #dee2e6',
                    display: 'flex',
                    justifyContent: 'center', // 중앙 정렬
                    alignItems: 'center',
                    height: '70px' // 높이도 적당히 지정해주면 더 깔끔
                }}
            >
                <a href="/organization/home" className="navbar-logo"
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#333',
                        textDecoration: 'none'
                    }}
                >
                    Logo
                </a>
            </div>
            <Outlet />
            <Footer />
        </>
    );
}
