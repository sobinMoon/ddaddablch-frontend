import React from 'react';
import './Donations.css';
import { useNavigate } from 'react-router-dom';

export default function Donations({ recentDonations }) {
    const navigate = useNavigate();
    //console.log(recentDonations);

    /*"recentDonations": [
            {
                "donationId": 3,
                "campaignName": "길고양이 구조, 함께해요",
                "donationAmount": 5.00000000,
                "donationDate": "2025-06-01 04:36:31",
                "transactionHash": "0x89258cc2007fff53f8488496697b295f8367f73fa3e1bedff7ebbeed577f8470",
                "donationStatus": "SUCCESS",
                "campaignImageUrl": "https://images.unsplash.com/photo-1651169007722-ce4a5fb6eaae?q=80&w=1958&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
        ]*/

    return (
        <div className="mypage-content">
            <div className="donations-list">    
                {recentDonations && recentDonations.length > 0 ? (
                    recentDonations.map((donation) => (
                        <div key={donation.donationId} className="mypage-donation-item" onClick={() => {
                            navigate(`/donate/campaign/${donation.campaignId}`);
                        }}>
                            <div className="mypage-donation-date">{new Date(donation.donationDate).toLocaleDateString()}</div>
                            <div className="mypage-donation-title">{donation.campaignName}</div>
                            <div className="mypage-donation-amount">{donation.donationAmount} ETH</div>
                            <div className="transaction-hash-container">
                            <div className="mypage-donation-transactionHash-label">Transaction Hash</div>
                            <span className="mypage-donation-transactionHash">{donation.transactionHash}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-donations">기부 내역이 없습니다.</p>
                )}
            </div>
        </div>
    );
} 