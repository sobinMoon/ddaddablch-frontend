import React, { useState } from 'react';
import './StudentProfileEdit.css';

export default function StudentProfileEdit() {
    const [profileImage, setProfileImage] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="student-profile-edit-container">
            <label htmlFor="name">이름*</label>
            <input className="profile-edit-input" name="name" id="name" placeholder="박은수" />

            <label htmlFor="nickname">닉네임*</label>
            <input className="profile-edit-input" name="nickname" id="nickname" placeholder="메로나" />

            <label htmlFor="password">비밀번호*</label>
            <input className="profile-edit-input" type="password" name="password" id="password" placeholder="비밀번호를 입력해주세요" />

            <label>프로필 이미지(선택)</label>
            <div className="profileimage-upload-edit-wrapper">
                {previewUrl && (
                    <img src={previewUrl} alt="프로필 미리보기" className="profileimage-edit-preview" />
                )}
                <label htmlFor="profileImageInput" className="profileimage-upload-edit">
                    +
                </label>
                <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );
}