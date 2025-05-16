import React, { useState } from 'react';
import './CreatePost.css';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // 🔥 이 줄 추가
  const [fileName, setFileName] = useState('');

  const handleSubmit = () => {
    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    console.log('제출됨:', { title, content, image });

    setTitle('');
    setContent('');
    setImage(null);
    setPreviewUrl(null);
    setFileName('');
    alert('게시글이 등록되었습니다!');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // 🔥 이미지 미리보기 URL 설정
    } else {
      alert('이미지 파일만 업로드할 수 있습니다.');
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-title">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="create-post-content">
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
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

      <button className="create-post-submit" onClick={handleSubmit}>
        등록하기
      </button>
    </div>
  );
}
