import React, { useState } from 'react';
import './Posts.css';
import { AiOutlineHeart } from 'react-icons/ai';
import { FaRegCommentDots } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin5Fill } from "react-icons/ri";
import SERVER_URL from '../../hooks/SeverUrl';

export default function Posts({ recentPosts, onPostDelete }) {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    const handlePostClick = (postId) => {
        navigate(`/community/post/${postId}`);
    }

    const handleDeleteClick = async (e, postId) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        if (isDeleting) return; // 이미 삭제 중이면 중복 실행 방지
        
        if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

        setIsDeleting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${SERVER_URL}/api/v1/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            
            if (data.isSuccess) {
                // 부모 컴포넌트의 onPostDelete 콜백을 호출하여 목록에서 제거
                onPostDelete(postId);
            } else {
                alert('게시글 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('게시글 삭제 중 오류 발생:', error);
            alert('게시글 삭제 중 오류가 발생했습니다.');
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="mypage-content">
            <div className="mypage-posts-list">    
                {recentPosts && recentPosts.length > 0 ? (
                    recentPosts.map((post) => (
                        <div key={post.postId} onClick={() => handlePostClick(post.postId)} className="mypage-post-item">
                            <div className="mypage-post-header">
                                <h4 className="mypage-post-title">{post.title}</h4>
                                <div className="mypage-post-info">
                                    <div className="mypage-post-stats">    
                                        <div className="mypage-post-likes">
                                            <AiOutlineHeart />
                                            <span className="mypage-post-likes-text">{post.likeCount}</span>
                                        </div>
                                        <div className="mypage-post-comments">
                                            <FaRegCommentDots />
                                            <span className="mypage-post-comments-text">{post.commentCount}</span>
                                        </div>
                                       
                                    </div>
                                    <span className="mypage-post-separator">|</span>
                                    <span className="mypage-post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div 
                                            className="mypage-post-delete"
                                            onClick={(e) => handleDeleteClick(e, post.postId)}
                                            style={{ cursor: 'pointer',
                                                color: '#aaa',
                                                fontSize: '1.2rem',
                                                marginLeft: '10px'
                                            }}
                                        >
                                            <RiDeleteBin5Fill />
                                        </div>
                        </div>
                    ))
                ) : (
                    <p className="mypage-no-posts">작성한 글이 없습니다.</p>
                )}
            </div>
        </div>
    );
} 