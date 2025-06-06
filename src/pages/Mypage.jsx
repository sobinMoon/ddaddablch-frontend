import React, { useState, useEffect } from 'react';
import './Mypage.css';
import defaultProfile from '../assets/cat.jpg';
import MyInfo from '../components/mypage/MyInfo';
import Donations from '../components/mypage/Donations';
import Notifications from '../components/mypage/Notifications';
import Posts from '../components/mypage/Posts';
import { useNavigate } from 'react-router-dom';
import SERVER_URL from '../hooks/SeverUrl';

export default function Mypage() {
    const [activeTab, setActiveTab] = useState('my');
    const [hasNewNotifications, setHasNewNotifications] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('로그인이 필요한 서비스입니다.');
                    navigate('/login');
                    return;
                }

                const response = await fetch(`${SERVER_URL}/api/v1/mypage/student`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                
                if (data.isSuccess) {
                    setUserInfo(data);
                    // 읽지 않은 알림이 있는지 확인
                    setHasNewNotifications(data.result.unreadNotifications.length > 0);
                } else {
                    throw new Error(data.message || '사용자 정보를 가져오는데 실패했습니다.');
                }
            } catch (error) {
                console.error('사용자 정보 조회 중 오류:', error);
                alert(error.message || '사용자 정보를 가져오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const renderContent = () => {
        if (!userInfo) return null;

        switch (activeTab) {
            case 'my':
                return <MyInfo userInfo={userInfo} setActiveTab={setActiveTab} />;
            case 'donations':
                return <Donations recentDonations={userInfo.result.recentDonations} />;
            case 'notifications':
                return <Notifications notifications={userInfo.result.unreadNotifications} />;
            case 'posts':
                return <Posts recentPosts={userInfo.result.recentPosts} />;
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
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                navigate('/login');
            } else {
                alert(data.message || '로그아웃 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('로그아웃 중 오류:', error);
            alert('로그아웃 중 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return <div className="mypage-container"></div>;
    }

    if (!userInfo) {
        return <div className="mypage-container">사용자 정보를 불러올 수 없습니다.</div>;
    }

    return (
        <div className="mypage-container">
            <div className="profile-section">
                <div className="profile-info">
                    <img 
                        src={userInfo.result.sprofileImage || defaultProfile} 
                        alt="프로필" 
                        className="profile-image" 
                    />
                    <div className="profile-details">
                        <div className="profile-text">
                            <h2 className="profile-nickname">{userInfo.result.snickname}</h2>
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
