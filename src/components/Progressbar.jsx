import React from 'react'
import './Progressbar.css';

export default function Progressbar({ current, goal }) {
    const percentage = goal > 0 ? (current / goal) * 100 : 0;
    const formattedPercentage = percentage.toFixed(1); // 소수점 1자리

    return (
        <div className="progress-wrapper">
            <div className="progress-top">
                <span>
                <div id="goal-info">{(goal*10000).toLocaleString()}SCN 목표</div>
                    <div>{(current*10000).toLocaleString()}SCN 모금</div>
                </span>
                <span className='funding-percent'>{formattedPercentage}%</span>
            </div>

            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${percentage}%`, maxWidth:'100%' }}></div>
            </div>
        </div>
    );
}
