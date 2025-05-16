import React, { useState } from 'react';
import './Mypage.css';
import defaultProfile from '../assets/cat.jpg';
import MyInfo from '../components/mypage/MyInfo';
import Donations from '../components/mypage/Donations';
import Notifications from '../components/mypage/Notifications';
import Posts from '../components/mypage/Posts';

export default function Mypage() {
    const [activeTab, setActiveTab] = useState('my');
    const [hasNewNotifications, setHasNewNotifications] = useState(true); // 임시로 true로 설정

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
        </div>
    );
}
