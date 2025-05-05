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
  const MAX_LENGTH = 200;
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

  const handleChange = (e) => {
    const text = e.target.value;
  
    // 입력된 텍스트의 길이가 MAX_LENGTH 이하일 때만 상태 업데이트
    if (text.length <= MAX_LENGTH) {
      setInput(text);
    } else {
      setInput(text.slice(0, MAX_LENGTH)); // 길이 초과 시 잘라서 업데이트
    }
  };

  
  return (
    <div className="comment-container">
      <h3 className="comment-title">댓글을 남겨 응원해주세요</h3>
      <form onSubmit={handleSubmit} className="comment-form">
  <div className="textarea-wrapper">
    <textarea
      className="comment-input"
      value={input}
      onChange={handleChange}
      placeholder="댓글을 입력하세요"
      rows={3}
      maxLength={20} // 예시: 최대 글자 수
    />
    <div className="textarea-footer">
      <span className="char-count">{input.length}/{MAX_LENGTH}</span>
      <button type="submit" className="comment-button-inside">등록</button>
    </div>
  </div>
</form>


      <h3 className="comment-title">댓글 {comments.length}개</h3>
      <div style={{ height: '0.5px', backgroundColor: '#dee2e6', width: '100%' }}></div>

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
