import React from 'react'
import './Orgcard.css'
import { SlArrowRight } from "react-icons/sl";
import { useNavigate } from 'react-router-dom';

export default function Orgcard() {
    const navigate = useNavigate();

    const handleClick = () => {
        // TODO: Replace with actual organization ID from backend
        const orgId = 1;
        navigate(`/org-detail/${orgId}`);
    };

    return (
        <div className="orgcard-container">
            <div className="orgcard-header">
                <img
                    src="https://via.placeholder.com/40"
                    alt="profile"
                    className="orgcard-img"
                />
                <span className="orgcard-name">사단 법인 위액트</span>
            </div>
            <p className="orgcard-description">
            동물구조단체 사단법인 위액트는 기획재정부가 승인한 지정 기부금 단체로 신뢰성과 투명성을 기반으로 위기에 놓인 동물을 위하여 활동하며 공익 법인의 의무를 다합니다. 위액트는 봉사와 재능기부, 최소한의 유급 인력으로 운영되어 위기 동물 구조와 구조 동물의 식주, 치료 및 재활에 주력하여 후원금을 운용합니다.            </p>
            <div className='orgcard-footer'>
                <div className='orgcard-btn' onClick={handleClick}>
                    <span>자세히보기</span>
                    <SlArrowRight />
                </div>
            </div>
        </div>
    );
}
