import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Post.css';
import profileImage from '../assets/cat.jpg';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FaRegCommentDots } from "react-icons/fa";
import Comments from '../components/Comments';
import { TfiMenuAlt } from "react-icons/tfi";

export default function Post() {
    const [isLiked, setIsLiked] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [likeCount, setLikeCount] = useState(10);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleList = () => {
        const fromPage = new URLSearchParams(location.search).get('fromPage') || '1';
        navigate(`/community?page=${fromPage}`);
    };

    return <div className="post-container">
        <p className="post-title">‘모두를 위한 무장애 환경 : 누구나 누리는 사회’에 기부했어요</p>
        <div className="post-info">
            <div className="post-info-left">
                <span className='post-profile-image'>
                    <img src={profileImage} alt="profile" />
                </span>
                <span className="post-nickname">닉네임</span>
                <span>|</span>
                <span className="post-time">04-12 15:42</span>
            </div>
            <div className="post-info-right">
                <span className="post-view">조회 18</span>
                <span>|</span>
                <span className="post-card-comment">
                    <FaRegCommentDots className="post-card-comment-icon" /> 
                    <span className="post-card-comment-text">10</span>
                </span>
                <span className="post-card-likes">
                    <AiOutlineHeart className="post-card-heart-icon" /> 
                    <span className="post-card-likes-text">10</span>
                </span>
            </div>
        </div>

        <div className="post-content">
            <p className="post-content-text">
                '모두를 위한 무장애 환경 : 누구나 누리는 사회' 모금함에 0.12315ETH 기부했어요!!<br />
                송이들도 같이 참여해요
            </p>
            <img className='post-content-image' src={profileImage} alt="profile" />
        </div>

        <div className="post-footer">
            <button className="post-like-button" onClick={handleLike}>
                {isLiked ? <AiFillHeart className="post-like-icon liked" /> : <AiOutlineHeart className="post-like-icon" />}
                <span>좋아요 {likeCount} </span>
            </button>
            <button className="post-list-button" onClick={handleList}>
                <TfiMenuAlt className="post-menu-icon" />       
                <span>목록</span>
            </button>
        </div>

        <Comments />
    </div>;
}
