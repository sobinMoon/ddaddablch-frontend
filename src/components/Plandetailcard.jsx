import React from 'react'
import './Plandetailcard.css'

export default function Plandetailcard() {
    return (
        <div className='plan-wrap'>
            <h2 className="plan-title">기부금 사용계획 상세</h2>

            <div className="plan-box">
                <div className="plan-row">
                    <span>피학대견 치료비</span>
                    <span>500000ETH</span>
                </div>
                <div className="plan-row">
                    <span>동물구조 활동비</span>
                    <span>500000ETH</span>
                </div>
                <hr className="plan-divider" />

                <div className="plan-goal">
                    <span>목표 금액</span>
                    <span>1000000ETH</span>
                </div>
            </div>
            <div className='plan-notice'>
            <p> · 모금액이 계획보다 부족할 경우 규모를 축소하여 사업을 진행합니다.</p>

            </div>
        </div>

    )
}
