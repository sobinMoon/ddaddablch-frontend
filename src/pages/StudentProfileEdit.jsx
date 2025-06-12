import React, { useState, useEffect } from 'react';
import './StudentProfileEdit.css';
import SERVER_URL from '../hooks/SeverUrl';
import { useLocation, useNavigate } from 'react-router-dom';

export default function StudentProfileEdit() {
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [nickname, setNickname] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [token, setToken] = useState(''); // 임시 토큰 입력용
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const { userInfo } = useLocation().state;
    const [userInfoState, setUserInfoState] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo && userInfo.result && userInfo.result.snickname) {
            setNickname(userInfo.result.snickname);
            setPreviewUrl(`${SERVER_URL}/images/${userInfo.result.sprofileImage}`);
        }
    }, [userInfo]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
            setProfileImage(file);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const updateInfo = {
            nickname,
            currentPassword,
        };
        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify(updateInfo)], { type: 'application/json' });
        formData.append('updateInfo', jsonBlob);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${SERVER_URL}/api/v1/mypage/student/update`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (res.ok) {
                alert('프로필이 성공적으로 수정되었습니다.');
                navigate('/mypage');
            } else {
                setMessage('수정 실패: ' + (await res.text()));
            }
        } catch (err) {
            setMessage('에러 발생: ' + err.message);
        } finally {
            setIsLoading(false);
        }
        console.log('닉네임:', nickname);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const updateInfo = {
            currentPassword,
            newPassword,
            confirmNewPassword,
        };
        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify(updateInfo)], { type: 'application/json' });
        formData.append('updateInfo', jsonBlob);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${SERVER_URL}/api/v1/mypage/student/update/pwd`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (res.ok) {
                alert('비밀번호가 성공적으로 변경되었습니다.');
                navigate('/mypage');
            } else {
                setMessage('변경 실패: ' + (await res.text()));
            }
        } catch (err) {
            setMessage('에러 발생: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="student-profile-edit-container">
            <div className="profile-edit-tab-menu">
                <button
                    className={activeTab === 'profile' ? 'active' : 'inactive'}
                    onClick={() => setActiveTab('profile')}
                    disabled={isLoading}
                >
                    내 정보 수정
                </button>
                <button
                    className={activeTab === 'password' ? 'active' : 'inactive'}
                    onClick={() => setActiveTab('password')}
                    disabled={isLoading}
                >
                    비밀번호 변경
                </button>
            </div>

            {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit}>
                    <label >이름</label>
                    <div className='profile-no-edit'>{userInfo.result.sname}</div>

                    <label>이메일</label>
                    <div className='profile-no-edit'>{userInfo.result.semail}</div>

                    <label htmlFor="nickname">닉네임</label>
                    <input
                        className="profile-edit-input"
                        name="nickname"
                        id="nickname"
                        placeholder="닉네임을 입력하세요"
                        value={nickname}
                        onChange={e => setNickname(e.target.value)}
                    />

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
                    <button 
                        className='profile-edit-submit-btn' 
                        type="submit" 
                        style={{ marginTop: '24px', width: '100%' }}
                        disabled={isLoading}
                    >
                        {isLoading ? '수정하기' : '수정하기'}
                    </button>
                    {message && <div className='profile-edit-message'>{message}</div>}
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
                    <button 
                        className='profile-edit-submit-btn' 
                        type="submit" 
                        style={{ marginTop: '24px', width: '100%' }}
                        disabled={isLoading}
                    >
                        {isLoading ? '비밀번호 변경' : '비밀번호 변경'}
                    </button>
                    {message && <div className='profile-edit-message'>{message}</div>}
                </form>
            )}
        </div>
    );
}