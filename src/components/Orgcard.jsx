import React from 'react'
import './Orgcard.css'
import { SlArrowRight } from "react-icons/sl";
import { useNavigate } from 'react-router-dom';
import SERVER_URL from '../hooks/SeverUrl';

export default function Orgcard({ organization }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/org-detail/${organization.id}`);
    };

    return (
        <div className="orgcard-container">
            <div className="orgcard-header">
                <img
                    src={organization.profileImage ? `${SERVER_URL}/api/v1/images/${organization.profileImage}` : "https://via.placeholder.com/40"}
                    alt={organization.name}
                    className="orgcard-img"
                />
                <span className="orgcard-name">{organization.name}</span>
            </div>
            <p className="orgcard-description">
                {organization.description}
            </p>
            <div className='orgcard-footer'>
                <div className='orgcard-btn' onClick={handleClick}>
                    <span>자세히보기</span>
                    <SlArrowRight />
                </div>
            </div>
        </div>
    );
}
