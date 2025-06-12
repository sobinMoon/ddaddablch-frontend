import React from 'react';
import './Postcard.css';
import defaultImage from '../assets/cat.jpg';
import { AiOutlineHeart } from 'react-icons/ai';
import { FaRegCommentDots } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import SERVER_URL from '../hooks/SeverUrl';

export default function Postcard({ post, onPostClick }) {
    const location = useLocation();
    const currentPage = new URLSearchParams(location.search).get('page') || '1';

    const handleClick = () => {
        if (onPostClick) {
            onPostClick();
        }
    };

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className="post-card">
            <div className="post-card-content">
                <Link 
                    to={`/community/post/${post.postId}?fromPage=${currentPage}`} 
                    className="post-card-title-link"
                    onClick={handleClick}
                >
                    <h3 className="post-card-title">{post.title}</h3>
                </Link>
                <p className="post-card-preview">{post.previewContent}</p>
                <div className="post-card-info">
                    <span className="post-card-comment">
                        <FaRegCommentDots className="post-card-comment-icon" /> 
                        <span className="post-card-comment-text">{post.commentCount}</span>
                    </span>
                    <span className="post-card-likes">
                        <AiOutlineHeart className="post-card-heart-icon" /> 
                        <span className="post-card-likes-text">{post.likeCount}</span>
                    </span>
                    <span>|</span>
                    <span className="post-card-time">{formatDate(post.createdAt)}</span>
                    <span>|</span>
                    <span className="post-card-nickname">{post.studentUser.nickname}</span>
                </div>
            </div>

            <img src={`${SERVER_URL}/images/${post.nft}` || defaultImage} alt="post-image" className="post-card-image" />
        </div>
    );
}
