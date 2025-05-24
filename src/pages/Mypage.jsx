import React, { useState, useContext } from 'react';
import './Mypage.css';
import defaultProfile from '../assets/cat.jpg';
import MyInfo from '../components/mypage/MyInfo';
import Donations from '../components/mypage/Donations';
import Notifications from '../components/mypage/Notifications';
import Posts from '../components/mypage/Posts';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../hooks/AuthContext';
import SERVER_URL from '../hooks/SeverUrl';
export default function Mypage() {
    const [activeTab, setActiveTab] = useState('my');
    const [hasNewNotifications, setHasNewNotifications] = useState(true); // 임시로 true로 설정
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const renderContent = () => {
        switch (activeTab) {
            case 'my':
                return <MyInfo />;
            case 'donations':
                return <Donations />;
            case 'notifications':
                return <Notifications />;
            case 'posts':
                return <Posts />;
            default:
                return null;
        }
    };

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (!refreshToken) {
                alert('로그인 정보가 없습니다.');
                return;
            }

            const response = await fetch(`${SERVER_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken })
            });

            const data = await response.json();

            if (response.ok) {
                // 로컬 스토리지의 토큰들 제거
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                // Context의 사용자 정보 초기화
                setUser(null);
                // 로그인 페이지로 리다이렉트
                navigate('/login');
            } else {
                alert(data.message || '로그아웃 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('로그아웃 중 오류:', error);
            alert('로그아웃 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="mypage-container">
            <div className="profile-section">
                <div className="profile-info">
                    <img src={defaultProfile} alt="프로필" className="profile-image" />
                    <div className="profile-details">
                        <div className="profile-text">
                            <h2 className="profile-nickname">닉네임</h2>
                            <button className="edit-profile-btn">수정</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tab-section">
                <div className="tab-menu">
                    <button 
                        className={`tab-button ${activeTab === 'my' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my')}
                    >
                        MY
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'donations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('donations')}
                    >
                        기부내역
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        알림
                        {hasNewNotifications && <span className="new-badge">N</span>}
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        작성글
                    </button>
                </div>
                {renderContent()}
            </div>
            <div className="mypage-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    로그아웃
                </button>
            </div>
        </div>
    );
}
