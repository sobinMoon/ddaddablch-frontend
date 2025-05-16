import React from 'react';
import './TotalDonation.css';
import Image from '../assets/heart_noonsong.png';


export default function TotalDonation() {
    const totalDonation = {
        amount: "1,234,567.89",
        count: "12,345",
        donors: "8,765"
    };

    return (
        <div className="total-donation">
            <div className="total-donation-header">
                <span className='total-donation-info'>
                    <span className='total-donation-msg'>
                        {'뭔가 따뜻한 카피\n두 줄로'}
                    </span>
                    <span className='total-donation-date'>2025.04.05 18시 기준</span>
                </span>
                <img className='total-donation-image' src={Image} />
            </div>
            <div className='total-donation-content'>
                <span className='total-donation-title'>총 기부금</span>
                <span className='total-donation-amount'>1,234,567.89 ETH</span>
            </div>
        </div>
    );
} 