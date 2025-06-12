import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './Post.css';
import defaultImage from '../assets/cat.jpg';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FaRegCommentDots } from "react-icons/fa";
import Comments from '../components/Comments';
import { TfiMenuAlt } from "react-icons/tfi";
import SERVER_URL from '../hooks/SeverUrl';

export default function Post() {
    const [isLiked, setIsLiked] = useState(false);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { postId } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log(postId);
                const response = await fetch(`${SERVER_URL}/api/v1/posts/${postId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                console.log(data);
                
                if (data.isSuccess) {
                    setPost(data.result);
                    setIsLiked(data.result.liked);
                }
            } catch (error) {
                console.error('게시글을 불러오는 중 오류가 발생했습니다:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
        window.scrollTo(0, 0);
    }, [postId]);

    const handleLike = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요한 서비스입니다.');
                navigate('/login');
                return;
            }

            const response = await fetch(`${SERVER_URL}/api/v1/posts/${postId}/likes`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            
            if (data.isSuccess) {
                setIsLiked(!isLiked);
                setPost(prev => ({
                    ...prev,
                    likeCount: isLiked ? prev.likeCount - 1 : prev.likeCount + 1
                }));
            } else {
                throw new Error(data.message || '좋아요 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('좋아요 처리 중 오류가 발생했습니다:', error);
            alert(error.message || '좋아요 처리 중 오류가 발생했습니다.');
        }
    };

    const handleList = () => {
        const fromPage = new URLSearchParams(location.search).get('fromPage') || '1';
        navigate(`/community?page=${fromPage}`);
    };

    if (loading) {
        return <div className="post-container"></div>;
    }

    if (!post) {
        return <div className="post-container">게시글을 찾을 수 없습니다.</div>;
    }

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${month}-${day} ${hours}:${minutes}`;
    };

    return (
        <div className="post-container">
            <p className="post-title">{post.title}</p>
            <div className="post-info">
                <div className="post-info-left">
                    <span className='post-profile-image'>
                        <img src={`${SERVER_URL}/images/${post.studentUser.profileImage}` || defaultImage} alt="profile" />
                    </span>
                    <span className="post-nickname">{post.studentUser.nickname}</span>
                    <span>|</span>
                    <span className="post-time">{formatDate(post.createdAt)}</span>
                </div>
                <div className="post-info-right">
                    <span className="post-card-comment">
                        <FaRegCommentDots className="post-card-comment-icon" /> 
                        <span className="post-card-comment-text">{post.commentCount}</span>
                    </span>
                    <span className="post-card-likes">
                        <AiOutlineHeart className="post-card-heart-icon" /> 
                        <span className="post-card-likes-text">{post.likeCount}</span>
                    </span>
                </div>
            </div>

            <div className="post-content">
                <p className="post-content-text">
                    {post.content.replace(/\\n|¶/g, '\n')}
                </p>
                {post.nft && <img className='post-content-image' src={`${SERVER_URL}/images/${post.nft}`} alt="post" />}
            </div>

            <div className="post-footer">
                <button className="post-like-button" onClick={handleLike}>
                    {isLiked ? <AiFillHeart className="post-like-icon liked" /> : <AiOutlineHeart className="post-like-icon" />}
                    <span>좋아요 {post.likeCount}</span>
                </button>
                <button className="post-list-button" onClick={handleList}>
                    <TfiMenuAlt className="post-menu-icon" />       
                    <span>목록</span>
                </button>
            </div>
            <Comments type="post" id={postId} />
        </div>
    );
}
