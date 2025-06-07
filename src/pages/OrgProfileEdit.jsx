import React, { useState, useEffect } from 'react';
import './OrgProfileEdit.css';
import { useLocation } from 'react-router-dom';
import SERVER_URL from '../hooks/SeverUrl';

export default function OrgProfileEdit() {
    const { organization } = useLocation().state;
    const [activeTab, setActiveTab] = useState('profile');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        if (organization && organization.odescription) {
            setDescription(organization.odescription);
        }
    }, [organization]);

    useEffect(() => {
        if (organization && organization.oprofileImage) {
            setPreviewUrl(`${SERVER_URL}/images/${organization.oprofileImage}`);
        }
    }, [organization]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            setProfileImage(file);
        }
    };
    console.log('organization:', organization);

    // 정보 수정 제출
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const updateInfo = {
            description,
            currentPassword,
        };
        const jsonBlob = new Blob([JSON.stringify(updateInfo)], { type: 'application/json' });
        formData.append('updateInfo', jsonBlob);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${SERVER_URL}/api/v1/org/update`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (res.ok) {
                setMessage('정보가 성공적으로 수정되었습니다.');
            } else {
                setMessage('수정 실패: ' + (await res.text()));
            }
        } catch (err) {
            setMessage('에러 발생: ' + err.message);
        }
    };
// 비밀번호 변경 제출
const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // FormData 방식으로 변경
    const formData = new FormData();
    const updatePwd = {
        currentPassword,
        newPassword,
        confirmNewPassword,
    };
    
    // JSON을 Blob으로 변환해서 추가
    formData.append('updateInfo', new Blob([JSON.stringify(updatePwd)], {
        type: 'application/json'
    }));
    
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${SERVER_URL}/api/v1/org/update/pwd`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                // Content-Type 헤더 제거 (브라우저가 자동 설정)
            },
            body: formData, //  JSON 대신 FormData 사용
        });
        
        if (res.ok) {
            setMessage('비밀번호가 성공적으로 변경되었습니다.');
        } else {
            setMessage('비밀번호 변경 실패: ' + (await res.text()));
        }
    } catch (err) {
        setMessage('에러 발생: ' + err.message);
    }
};
    return (
        <div className="student-profile-edit-container">
            <div className="profile-edit-tab-menu">
                <button
                    className={activeTab === 'profile' ? 'active' : 'inactive'}
                    onClick={() => setActiveTab('profile')}
                >
                    정보 수정
                </button>
                <button
                    className={activeTab === 'password' ? 'active' : 'inactive'}
                    onClick={() => setActiveTab('password')}
                >
                    비밀번호 변경
                </button>
            </div>

            {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit}>
                    <label >단체명</label>
                    <div className='profile-no-edit'>{organization.onName}</div>

                    <label>이메일</label>
                    <div className='profile-no-edit'>{organization.oemail}</div>

                    <label>사업자 번호</label>
                    <div className='profile-no-edit'>{organization.obusinessNumber
                    }</div>

                   
                    <label>프로필 이미지</label>
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

                    <label htmlFor="description">단체 소개</label>
                    <input
                        className="profile-edit-input"
                        name="description"
                        id="description"
                        placeholder="단체 소개를 입력해주세요"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />

                    <label htmlFor="currentPassword">현재 비밀번호</label>
                    <input
                        className="profile-edit-input"
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        placeholder="현재 비밀번호를 입력해주세요"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                    />
                    <button className='profile-edit-submit-btn' type="submit" style={{ marginTop: '24px', width: '100%' }}>수정하기</button>
                    {message && <div style={{ marginTop: '16px', color: 'red' }}>{message}</div>}
                </form>
            )}
            {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit}>
                    <label htmlFor="newPassword">새 비밀번호</label>
                    <input
                        className="profile-edit-input"
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        placeholder="새 비밀번호를 입력해주세요"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />

                    <label htmlFor="confirmNewPassword">새 비밀번호 확인</label>
                    <input
                        className="profile-edit-input"
                        type="password"
                        name="confirmNewPassword"
                        id="confirmNewPassword"
                        placeholder="새 비밀번호를 다시 입력해주세요"
                        value={confirmNewPassword}
                        onChange={e => setConfirmNewPassword(e.target.value)}
                    />
                    <label htmlFor="currentPassword">현재 비밀번호</label>
                    <input
                        className="profile-edit-input"
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        placeholder="현재 비밀번호를 입력해주세요"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                    />
                    <button className='profile-edit-submit-btn' type="submit" style={{ marginTop: '24px', width: '100%' }}>비밀번호 변경</button>
                    {message && <div style={{ marginTop: '16px', color: 'red' }}>{message}</div>}
                </form>
            )}
        </div>
    );
}