import React from 'react';
import './Postcard.css';
import defaultImage from '../assets/cat.jpg';
import { AiOutlineHeart } from 'react-icons/ai';
import { FaRegCommentDots } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';

export default function Postcard({ onPostClick }) {
    const location = useLocation();
    const currentPage = new URLSearchParams(location.search).get('page') || '1';

    const handleClick = () => {
        if (onPostClick) {
            onPostClick();
        }
    };

    return (
        <div className="post-card">
            <div className="post-card-content">
                <Link 
                    to={`/community/post/1?fromPage=${currentPage}`} 
                    className="post-card-title-link"
                    onClick={handleClick}
                >
                    <h3 className="post-card-title">'모두를 위한 무장애 환경 : 누구나 누리는 사회'에 기부했어요</h3>
                </Link>
                <p className="post-card-preview">'모두를 위한 무장애 환경 : 누구나 누리는 사회' 모금함에 0.12315ETH 기부했어요!!
                송이들도 같이 참여해요'모두를 위한 무장애 환경 : 누구나 누리는 사회' 모금함에 0.12315ETH 기부했어요!!
                송이들도 같이 참여해요'모두를 위한 무장애 환경 : 누구나 누리는 사회' 모금함에 0.12315ETH 기부했어요!!
                송이들도 같이 참여해요'모두를 위한 무장애 환경 : 누구나 누리는 사회' 모금함에 0.12315ETH 기부했어요!!
                송이들도 같이 참여해요</p>
                <div className="post-card-info">
                    <span className="post-card-comment">
                        <FaRegCommentDots className="post-card-comment-icon" /> 
                        <span className="post-card-comment-text">10</span>
                    </span>
                    <span className="post-card-likes">
                        <AiOutlineHeart className="post-card-heart-icon" /> 
                        <span className="post-card-likes-text">10</span>
                    </span>
                    <span>|</span>
                    <span className="post-card-time">15:42</span>
                    <span>|</span>
                    <span className="post-card-nickname">닉네임</span>
                </div>
            </div>

            <img src={defaultImage} alt="post-image" className="post-card-image" />
            
        </div>
    );
}
