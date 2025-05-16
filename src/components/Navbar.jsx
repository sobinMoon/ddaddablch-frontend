import React from 'react';
import "./Navbar.css"; 
import { NavLink } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import useAuth from '../hooks/useAuth';
import defaultProfile from '../assets/cat.jpg';

export default function Navbar() {
    const { isLoggedIn } = useAuth();

    const getNavLinkClass = ({ isActive }) => {
        return isActive ? 'navbar-link active' : 'navbar-link';
    };
    
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <a href="/" className="navbar-logo">
                    Logo
                </a>
            </div>

            <div className="navbar-center">
                <ul className="navbar-menu">
                    <li><NavLink to="/" className={getNavLinkClass}>홈</NavLink></li>
                    <li><NavLink to="/donate" className={getNavLinkClass}>기부하기</NavLink></li>
                    <li><NavLink to="/reviews" className={getNavLinkClass}>모금후기</NavLink></li>
                    <li><NavLink to="/community" className={getNavLinkClass}>커뮤니티</NavLink></li>
                </ul>
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
