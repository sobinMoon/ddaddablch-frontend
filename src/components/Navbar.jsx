import React, { useEffect, useState } from 'react';
import "./Navbar.css"; 
import { NavLink } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import defaultProfile from '../assets/cat.jpg';
import SERVER_URL from '../hooks/SeverUrl';

export default function Navbar() {
    const [role, setRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoggedIn(false);
                return;
            }

            try {
                const response = await fetch(`${SERVER_URL}/auth/me`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setRole(data.role);
                    setIsLoggedIn(true);
                } else {
                    // 토큰 만료 또는 인증 실패
                    setRole(null);
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('사용자 정보 요청 실패:', error);
                setIsLoggedIn(false);
            }
        };

        fetchUserInfo();
    }, []);

    const getNavLinkClass = ({ isActive }) => (
        isActive ? 'navbar-link active' : 'navbar-link'
    );

    const renderMenu = () => {
        if (role === 'ROLE_ORGANIZATION') return (
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

        );

        return (
            <ul className="navbar-menu">
                <li><NavLink to="/" className={getNavLinkClass}>홈</NavLink></li>
                <li><NavLink to="/donate" className={getNavLinkClass}>기부하기</NavLink></li>
                <li><NavLink to="/reviews" className={getNavLinkClass}>모금후기</NavLink></li>
                <li><NavLink to="/community" className={getNavLinkClass}>커뮤니티</NavLink></li>
            </ul>
        );
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <a href="/" className="navbar-logo">
                    Logo
                </a>
            </div>

            <div className="navbar-center">
                {renderMenu()}
            </div>

            <div className="navbar-right">
                {isLoggedIn ? (
                    <NavLink to="/mypage" className="profile-link">
                        <img src={defaultProfile} alt="프로필" className="profile-img" />
                    </NavLink>
                ) : (
                    <a href="/login" className="navbar-login">로그인</a>
                )}
                <button className="navbar-search-icon" aria-label="검색">
                    <IoSearchSharp />
                </button>
            </div>
        </nav>
    );
}
