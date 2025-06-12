import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import { IoSnow } from "react-icons/io5";

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
                        fontWeight: '800',
                        color: '#0071ce',
                        textDecoration: 'none',
                        fontFamily: '"Fauna One", serif',
                        letterSpacing: '-0.01em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.1rem'
                    }}
                >
                    <IoSnow />
                    SOOKCHAIN
                </a>
            </div>
            <Outlet />
            <Footer />
        </>
    );
}
