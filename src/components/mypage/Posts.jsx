import React from 'react';
import './Posts.css';
import { AiOutlineHeart } from 'react-icons/ai';
import { FaRegCommentDots } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function Posts({ recentPosts }) {
    console.log(recentPosts);
    const navigate = useNavigate();
    const handlePostClick = (postId) => {
        navigate(`/community/post/${postId}`);
        console.log(postId);
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
                        </div>
                    ))
                ) : (
                    <p className="mypage-no-posts">작성한 글이 없습니다.</p>
                )}
            </div>
        </div>
    );
} 