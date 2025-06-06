import React, { useEffect, useState } from 'react';
import './TotalDonation.css';
import Image from '../assets/heart_noonsong.png';

export default function TotalDonation({ totalDonation }) {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');

        const formattedTime = `${year}.${month}.${date} ${hour}시 기준`;
        setCurrentTime(formattedTime);
    }, []);

    return (
        <div className="total-donation">
            <div className="total-donation-header">
                <span className='total-donation-info'>
                    <span className='total-donation-msg'>
                        {'모아진 마음,\n함께 만든 기적'}
                    </span>
                    <span className='total-donation-date'>{currentTime}</span>
                </span>
                <img className='total-donation-image' src={Image} alt="Heart Icon" />
            </div>
            <div className='total-donation-content'>
                <span className='total-donation-title'>총 기부금</span>
                <span className='total-donation-amount'>{totalDonation} ETH</span>
            </div>
        </div>
    );
}
