import React, { useState, useEffect } from 'react';
import './MyInfo.css';
import SERVER_URL from '../../hooks/SeverUrl';
import { useNavigate } from 'react-router-dom';

export default function MyInfo  ({ userInfo, setActiveTab }) {
    const [subscriptions, setSubscriptions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/api/organizations/subscriptions/student/${userInfo.result.sid}`);
                if (response.ok) {
                    const data = await response.json();
                    setSubscriptions(data);
                }
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
            }
        };

        if (userInfo?.result?.sid) {
            fetchSubscriptions();
        }
    }, [userInfo]);

    console.log('userInfo:', userInfo);
    // const userInfo = {
    //     "isSuccess": true,
    //     "code": "MYPAGE201",
    //     "message": "학생 마이페이지가 성공적으로 조회되었습니다.",
    //     "result": {
    //         "walletAddresses": [],
    //         "createdAt": "2025-05-28 22:39:05",
    //         "totalDonationAmount": 5.00000000,
    //         "totalDonationCount": 1,
    //         "recentDonations": [
    //             {
    //                 "donationId": 3,
    //                 "campaignName": "길고양이 구조, 함께해요",
    //                 "donationAmount": 5.00000000,
    //                 "donationDate": "2025-06-01 04:36:31",
    //                 "transactionHash": "0x89258cc2007fff53f8488496697b295f8367f73fa3e1bedff7ebbeed577f8470",
    //                 "donationStatus": "SUCCESS",
    //                 "campaignImageUrl": "https://images.unsplash.com/photo-1651169007722-ce4a5fb6eaae?q=80&w=1958&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //             }
    //         ],
    //         "recentPosts": [
    //             {
    //                 "postId": 1,
    //                 "title": "캠페인제목",
    //                 "createdAt": "2025-06-01 04:03:25",
    //                 "likeCount": 0,
    //                 "commentCount": 2,
    //                 "pnft": "nft항목입니다요"
    //             }
    //         ],
    //         "recentComments": [],
    //         "unreadNotifications": [
    //             {
    //                 "createdAt": "2025-06-01T04:37:54.622342",
    //                 "updatedAt": "2025-06-01T04:37:54.622342",
    //                 "notificationId": 4,
    //                 "studentId": 140,
    //                 "title": "새 댓글이 달렸습니다",
    //                 "content": "메로나님이 회원님의 게시글에 댓글을 달았습니다",
    //                 "notificationType": "POST_COMMENT",
    //                 "relatedPostId": 1,
    //                 "relatedDonationId": null,
    //                 "isRead": false,
    //                 "redirectUrl": "api/v1/posts/1"
    //             },
    //             {
    //                 "createdAt": "2025-06-01T04:36:31.471224",
    //                 "updatedAt": "2025-06-01T04:36:31.471224",
    //                 "notificationId": 3,
    //                 "studentId": 140,
    //                 "title": "기부가 완료되었습니다",
    //                 "content": "길고양이 구조, 함께해요 캠페인에 기부가 성공적으로 완료되었습니다",
    //                 "notificationType": "DONATION_COMPLETE",
    //                 "relatedPostId": null,
    //                 "relatedDonationId": 3,
    //                 "isRead": false,
    //                 "redirectUrl": "/api/v1/campaigns/8"
    //             }
    //         ],
    //         "sprofileImage": null,
    //         "sid": 140,
    //         "snickname": "me",
    //         "sname": "김과연",
    //         "semail": "seobeen624@sookmyung.ac.kr"
    //     }
    // };

    const handleDonationsClick = () => {
        setActiveTab('donations');
    };

    const handleOrganizationClick = (organizationId) => {
        navigate(`/org-detail/${organizationId}`);
    };

    return (
        <div className="mypage-content">
            <div className="myinfo-donates">
                <div className="myinfo-donates-header">
                    <span className="myinfo-donates-header-title">기부 내역</span>
                    <button 
                        className="myinfo-donates-header-button"
                        onClick={handleDonationsClick}
                    >
                        자세히 보기
                    </button>
                </div>
                <div className="myinfo-donates-content">
                    <div className="myinfo-donates-content-total">
                        <span className="myinfo-donates-content-total-title">총 기부금</span>
                        <span className="myinfo-donates-content-total-amount">{userInfo.result.totalDonationAmount}ETH</span>
                    </div>
                    <div className="myinfo-donates-content-count">
                        <span className="myinfo-donates-content-count-title">기부 횟수</span>
                        <span className="myinfo-donates-content-count-amount">{userInfo.result.totalDonationCount}회</span>
                    </div>
                </div>
            </div>

            <div className="myinfo-nft-container">
                <div className="myinfo-nft-header">
                    <span className="myinfo-nft-header-title">NFT 보유 내역</span>
                </div>
                <div className="myinfo-nft-content">
                    <div className="myinfo-nft-content-item"></div>
                </div>
            </div>

            <div className="myinfo-subscriptions-container">
                <div className="myinfo-subscriptions-header">
                    <span className="myinfo-subscriptions-header-title">구독 중인 단체</span>
                </div>
                <div className="myinfo-subscriptions-content">
                    {subscriptions.length > 0 ? (
                        subscriptions.map((subscription) => (
                            <div 
                                key={subscription.subscriptionId} 
                                className="myinfo-subscription-item"
                                onClick={() => handleOrganizationClick(subscription.organizationId)}
                            >
                                <div className="myinfo-subscription-info">
                                    <h3 className="myinfo-subscription-name">{subscription.organizationName}</h3>
                                    <p className="myinfo-subscription-description">{subscription.organizationDescription.replace(/\\n|¶/g, ' ')}</p>
                                    <p className="myinfo-subscription-date">구독일: {new Date(subscription.subscribedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="myinfo-subscription-empty">구독 중인 단체가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
} 