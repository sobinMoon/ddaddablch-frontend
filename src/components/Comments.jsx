import React, { useState } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import './Comments.css';

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};


export default function Comments() {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newComment = {
      id: Date.now(),
      nickname: '익명',
      content: input.trim(),
      createdAt: formatDate(new Date()),
      likes: 0,
      liked: false,
    };

    setComments([newComment, ...comments]);
    setInput('');
  };

  const handleLike = (id) => {
    setComments(comments.map(comment =>
      comment.id === id
        ? {
            ...comment,
            liked: !comment.liked,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
          }
        : comment
    ));
  };

  return (
    <div className="comment-container">
      <h3 className="comment-title">댓글</h3>

      <form onSubmit={handleSubmit} className="comment-form">
  <div className="textarea-wrapper">
    <textarea
      className="comment-input"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="댓글을 입력하세요"
      rows={3}
    />
    <button type="submit" className="comment-button-inside">등록</button>
  </div>
</form>



      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            <img
              src="https://via.placeholder.com/40"
              alt="profile"
              className="comment-profile"
            />
            <div className="comment-main">
              <div className="comment-content">
                <p className="comment-nickname">{comment.nickname}</p>
                <p className="comment-text">{comment.content}</p>
              </div>
              <div className="comment-meta">
                <button
                  className="like-button"
                  onClick={() => handleLike(comment.id)}
                >
                  {comment.liked ? (
                    <AiFillHeart className="heart-icon filled" />
                  ) : (
                    <AiOutlineHeart className="heart-icon" />
                  )}
                </button>
                <span className="like-count">{comment.likes}</span>
                <span className="comment-date">{comment.createdAt}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
