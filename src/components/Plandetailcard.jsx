import React from 'react'
import './Plandetailcard.css'

export default function Plandetailcard({ flag, campaignPlans, goal, amount }) {
    return (
        <div className='plan-wrap'>
            <h2 className="plan-title">{flag === 'isNews' ? '모금액 사용 내역' : '기부금 사용계획 상세'}</h2>

            <div className="plan-box">
                {campaignPlans.map((plan) => (
                    <div key={plan.id} className="plan-row">
                        <span>{plan.title}</span>
                        <span>{plan.amount}ETH</span>
                    </div>
                ))}
                <hr className="plan-divider" />

                <div className="plan-goal">
                    <span>{flag === 'isNews' ? '모금액' : '목표 금액'}</span>
                    <span>{flag === 'isNews' ? amount : goal}ETH</span>
                </div>
                
            </div>
            <div className='plan-notice'>
                <p> · 모금액이 계획보다 부족할 경우 규모를 축소하여 사업을 진행합니다.</p>
            </div>
        </div>
    )
}
