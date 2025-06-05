import React, { useState, useContext } from 'react';
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
    const [hasNewNotifications, setHasNewNotifications] = useState(true); // 임시로 true로 설정
    const navigate = useNavigate();
    const userInfo = {
        "isSuccess": true,
        "code": "MYPAGE201",
        "message": "학생 마이페이지가 성공적으로 조회되었습니다.",
        "result": {
            "walletAddresses": [],
            "createdAt": "2025-05-28 22:39:05",
            "totalDonationAmount": 5.00000000,
            "totalDonationCount": 1,
            "recentDonations": [
                {
                    "donationId": 3,
                    "campaignName": "길고양이 구조, 함께해요",
                    "donationAmount": 5.00000000,
                    "donationDate": "2025-06-01 04:36:31",
                    "transactionHash": "0x89258cc2007fff53f8488496697b295f8367f73fa3e1bedff7ebbeed577f8470",
                    "donationStatus": "SUCCESS",
                    "campaignImageUrl": "https://images.unsplash.com/photo-1651169007722-ce4a5fb6eaae?q=80&w=1958&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
            ],
            "recentPosts": [
                {
                    "postId": 1,
                    "title": "캠페인제목",
                    "createdAt": "2025-06-01 04:03:25",
                    "likeCount": 0,
                    "commentCount": 2,
                    "pnft": "nft항목입니다요"
                },
                {
                    "postId": 2,
                    "title": "캠페인제목2",
                    "createdAt": "2025-06-01 04:03:25",
                    "likeCount": 10,
                    "commentCount": 1,
                }
            ],
            "recentComments": [],
            "unreadNotifications": [
                {
                    "createdAt": "2025-06-01T04:37:54.622342",
                    "updatedAt": "2025-06-01T04:37:54.622342",
                    "notificationId": 4,
                    "studentId": 140,
                    "title": "새 댓글이 달렸습니다",
                    "content": "메로나님이 회원님의 게시글에 댓글을 달았습니다",
                    "notificationType": "POST_COMMENT",
                    "relatedPostId": 1,
                    "relatedDonationId": null,
                    "isRead": false,
                    "redirectUrl": "api/v1/posts/1"
                },
                {
                    "createdAt": "2025-06-01T04:36:31.471224",
                    "updatedAt": "2025-06-01T04:36:31.471224",
                    "notificationId": 3,
                    "studentId": 140,
                    "title": "기부가 완료되었습니다",
                    "content": "길고양이 구조, 함께해요 캠페인에 기부가 성공적으로 완료되었습니다",
                    "notificationType": "DONATION_COMPLETE",
                    "relatedPostId": null,
                    "relatedDonationId": 3,
                    "isRead": false,
                    "redirectUrl": "/api/v1/campaigns/8"
                }
            ],
            "sprofileImage": null,
            "sid": 140,
            "snickname": "me",
            "sname": "김과연",
            "semail": "seobeen624@sookmyung.ac.kr"
        }
    };
    
    const renderContent = () => {
        switch (activeTab) {
            case 'my':
                return <MyInfo userInfo={userInfo} setActiveTab={setActiveTab} />;
            case 'donations':
                return <Donations recentDonations={userInfo.result.recentDonations} />;
            case 'notifications':
                return <Notifications />;
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
                // 로컬 스토리지의 토큰들 제거
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

 
    return (
        <div className="mypage-container">
            <div className="profile-section">
                <div className="profile-info">
                    <img src={userInfo.result.sprofileImage} alt="프로필" className="profile-image" />
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
