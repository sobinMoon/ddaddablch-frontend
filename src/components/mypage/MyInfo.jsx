import React from 'react';
import './MyInfo.css';

export default function MyInfo() {
    return (
        <div className="mypage-content">
            <div className="myinfo-donates">
                <div className="myinfo-donates-header">
                    <span className="myinfo-donates-header-title">기부 내역</span>
                    <button className="myinfo-donates-header-button">자세히 보기</button>
                </div>
                <div className="myinfo-donates-content">
                    <div className="myinfo-donates-content-total">
                        <span className="myinfo-donates-content-total-title">총 기부금</span>
                        <span className="myinfo-donates-content-total-amount">0.000012ETH</span>
                    </div>
                    <div className="myinfo-donates-content-count">
                        <span className="myinfo-donates-content-count-title">기부 횟수</span>
                        <span className="myinfo-donates-content-count-amount">10회</span>
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
        </div>
    );
} 