import React, { useState, useEffect } from 'react';
import './MyInfo.css';
import SERVER_URL from '../../hooks/SeverUrl';
import { useNavigate } from 'react-router-dom';

export default function MyInfo({ userInfo, setActiveTab }) {
    const [subscriptions, setSubscriptions] = useState([]);
    const [nfts, setNfts] = useState([]);
    const [isLoadingNfts, setIsLoadingNfts] = useState(true);
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

        const fetchNFTs = async () => {
            try {
                setIsLoadingNfts(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await fetch(`${SERVER_URL}/api/v1/mypage/student/nft`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch NFTs');
                }

                const data = await response.json();
                //console.log("NFT 데이터", data);
                if (data.isSuccess) {
                    setNfts(data.result);
                }
            } catch (error) {
                console.error('Error fetching NFTs:', error);
            } finally {
                setIsLoadingNfts(false);
            }
        };

        if (userInfo?.result?.sid) {
            fetchSubscriptions();
            fetchNFTs();
        }
    }, [userInfo]);

    //console.log('userInfo:', userInfo);
 
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
                    {isLoadingNfts ? (
                        <div className="myinfo-nft-loading"></div>
                    ) : nfts.length > 0 ? (
                        <div className="myinfo-nft-grid">
                            {nfts.map((nft, index) => (
                                <div key={index} className="myinfo-nft-item">
                                    <img 
                                        src={`${SERVER_URL}/images/${nft}`} 
                                        alt={`NFT ${index + 1}`} 
                                        className="myinfo-nft-image"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="myinfo-nft-empty">보유한 NFT가 없습니다.</div>
                    )}
                </div>
            </div>

            <div className="myinfo-subscriptions-container">
                <div className="myinfo-subscriptions-header">
                    <span className="myinfo-subscriptions-header-title">나의 구독 목록</span>
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