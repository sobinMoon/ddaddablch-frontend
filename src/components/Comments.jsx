import React, { useState, useEffect } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import './Comments.css';
import SERVER_URL from '../hooks/SeverUrl';

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

export default function Comments({ campaignId }) {
  const MAX_LENGTH = 200;
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 댓글 목록 조회
  const fetchComments = async (page = 0) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Accept': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${SERVER_URL}/api/v1/campaigns/${campaignId}/comments?page=${page}`, {
        headers
      });
      const data = await response.json();
      
      if (data.isSuccess) {
        const formattedComments = data.result.comments.map(comment => ({
          id: comment.id,
          content: comment.content,
          nickname: comment.studentUser.nickname,
          profileImage: comment.studentUser.profileImage,
          createdAt: formatDate(new Date(comment.createdAt)),
          likes: comment.likes,
          liked: comment.liked,
          userId: comment.studentUser.id
        }));
        setComments(formattedComments);
        setTotalPages(data.result.totalPages);
        setTotalElements(data.result.totalElements);
      }
    } catch (err) {
      console.error('댓글 목록 조회 중 오류:', err);
    }
  };

  useEffect(() => {
    fetchComments(currentPage);
  }, [campaignId, currentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      const response = await fetch(`${SERVER_URL}/api/v1/campaigns/${campaignId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: input.trim()
        })
      });

      const data = await response.json();
      
      if (data.isSuccess) {
        fetchComments(0); // 첫 페이지로 돌아가서 새로고침
        setInput('');
        setError('');
      } else {
        setError(data.message || '댓글 작성에 실패했습니다.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      console.error('댓글 작성 중 오류:', err);
    }
  };

  const handleLike = async (commentId, userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      // 본인 댓글인지 확인
      const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;
      if (currentUserId === userId) {
        setError('본인의 댓글은 좋아요할 수 없습니다.');
        return;
      }

      const response = await fetch(`${SERVER_URL}/api/v1/campaigns/${campaignId}/comments/${commentId}/likes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      if (data.isSuccess) {
        // 좋아요 성공 시 댓글 목록 새로고침
        fetchComments(currentPage);
      } else {
        setError(data.message || '좋아요 처리에 실패했습니다.');
      }
    } catch (err) {
      console.error('좋아요 처리 중 오류:', err);
      setError('서버 오류가 발생했습니다.');
    }
  };

  const handleChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_LENGTH) {
      setInput(text);
    } else {
      setInput(text.slice(0, MAX_LENGTH));
    }
  };

  return (
    <div className="comment-container">
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="textarea-wrapper">
          <textarea
            className="comment-input"
            value={input}
            onChange={handleChange}
            placeholder="댓글을 입력하세요"
            rows={3}
            maxLength={MAX_LENGTH}
          />
          <div className="textarea-footer">
            <span className="char-count">{input.length}/{MAX_LENGTH}</span>
            <button type="submit" className="comment-button-inside">등록</button>
          </div>
        </div>
      </form>
      {error && <p className="error-message">{error}</p>}

      <h3 className="comment-title">댓글 {totalElements}개</h3>
      <div style={{ height: '0.5px', backgroundColor: '#dee2e6', width: '100%' }}></div>

      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            <img
              src={comment.profileImage ? `${SERVER_URL}/api/v1/images/${comment.profileImage}` : "https://via.placeholder.com/40"}
              alt={comment.nickname}
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
                  onClick={() => handleLike(comment.id, comment.userId)}
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

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            이전
          </button>
          <span>{currentPage + 1} / {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
