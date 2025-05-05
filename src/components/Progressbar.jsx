import React from 'react'
import './Progressbar.css';

export default function Progressbar({ current, goal }) {
    const percentage = Math.min((current / goal) * 100, 100);
    const formattedPercentage = percentage.toFixed(1); // 소수점 1자리

    return (
        <div className="progress-wrapper">
            <div className="progress-top">
                <span>
                <div id="goal-info">{goal}ETH 목표</div>
                    <div>{current.toLocaleString()}ETH 모금</div>
                </span>
                <span className='funding-percent'>{formattedPercentage}%</span>
            </div>

            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}
