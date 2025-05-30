import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CreatePost.css';
import SERVER_URL from '../hooks/SeverUrl';

export default function CreatePost() {
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // 모달에서 전달받은 이미지가 있으면 설정
    if (location.state?.defaultImage) {
      setPreviewUrl(location.state.defaultImage);
      // 이미지 파일로 변환
      fetch(location.state.defaultImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "donation-nft.jpg", { type: "image/jpeg" });
          setImage(file);
          setFileName("donation-nft.jpg");
        });
      
      // 기부 정보가 있으면 제목과 내용에 추가
      if (location.state.donationInfo) {
        setTitle(`기부 인증- ${location.state.donationInfo.campaignName}`);
        setContent(`캠페인 "${location.state.donationInfo.campaignName}"에 ${location.state.donationInfo.amount} ETH를 기부했어요!`);
      }
    }
  }, [location]);

  const handleSubmit = async () => {
    // 입력값 검증
    if (!title || !content) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    if (title.length > 100) {
      setError('제목은 100자 이하로 입력해주세요.');
      return;
    }

    if (content.length > 5000) {
      setError('내용은 5000자 이하로 입력해주세요.');
      return;
    }

    if (!previewUrl) {
      setError('이미지를 업로드해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${SERVER_URL}/api/v1/community/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title,
          content: content,
          nft: previewUrl
        })
      });

      const data = await response.json();

      if (data.isSuccess) {
        alert('게시글이 등록되었습니다!');
        navigate(`/community/post/${data.result.postId}`);
      } else {
        // 서버에서 반환한 에러 메시지 표시
        if (data.result) {
          const errorMessages = Object.values(data.result).filter(msg => msg);
          setError(errorMessages.join('\n'));
        } else {
          setError(data.message || '게시글 등록에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('게시글 등록 중 오류:', error);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    } else {
      setError('이미지 파일만 업로드할 수 있습니다.');
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-title">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
          maxLength={100}
        />
      </div>

      <div className="create-post-content">
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError(null);
          }}
          maxLength={5000}
        />
      </div>

      <div className="create-post-image">
        <div className="file-upload-wrapper">
          {previewUrl && (
            <img src={previewUrl} alt="미리보기" className="image-preview" />
          )}
          <label htmlFor="fileInput" className="custom-file-upload">
            +
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <button 
        className="create-post-submit" 
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? '등록 중...' : '등록하기'}
      </button>
    </div>
  );
}
