import React, { useState, useEffect } from 'react';
import './OrgProfileEdit.css';
import { useLocation, useNavigate } from 'react-router-dom';
import SERVER_URL from '../hooks/SeverUrl';
import './OrgProfileEdit.css';

export default function OrgProfileEdit() {
    const { organization } = useLocation().state;
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
        
        // 현재 비밀번호 검증
        if (!currentPassword) {
            setMessage('현재 비밀번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);
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
                alert('프로필이 성공적으로 수정되었습니다.');
                navigate('/organization/home');
            } else {
                const errorText = await res.text();
                setMessage(errorText || '수정 실패');
            }
        } catch (err) {
            setMessage('에러 발생: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 비밀번호 변경 제출
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        // 현재 비밀번호 검증
        if (!currentPassword) {
            setMessage('현재 비밀번호를 입력해주세요.');
            return;
        }

        // 새 비밀번호 검증
        if (!newPassword || !confirmNewPassword) {
            setMessage('새 비밀번호를 모두 입력해주세요.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setMessage('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        const updatePwd = {
            currentPassword,
            newPassword,
            confirmNewPassword,
        };
        formData.append('updateInfo', new Blob([JSON.stringify(updatePwd)], {
            type: 'application/json'
        }));
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${SERVER_URL}/api/v1/org/update/pwd`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            
            const responseText = await res.text();
            console.log('비밀번호 변경 서버 응답:', {
                status: res.status,
                ok: res.ok,
                response: responseText
            });
            
            if (res.ok) {
                alert('비밀번호가 성공적으로 변경되었습니다.');
                navigate('/organization/home');
            } else {
                setMessage(responseText || '비밀번호 변경 실패');
            }
        } catch (err) {
            console.error('비밀번호 변경 에러:', err);
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
                    정보 수정
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
                    <div className='profile-no-edit'>{organization.onName}</div>

                    <label>이메일</label>
                    <div className='profile-no-edit'>{organization.oemail}</div>

                    <label>사업자 번호</label>
                    <div className='profile-no-edit'>{organization.obusinessNumber}</div>

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

                    <label htmlFor="description">소개글</label>
                    <textarea
                        className="profile-edit-textarea"
                        name="description"
                        id="description"
                        placeholder="소개글을 입력해주세요"
                        value={description}
                        maxLength={500}
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
                    <button 
                        className='profile-edit-submit-btn' 
                        type="submit" 
                        style={{ marginTop: '24px', width: '100%' }}
                        disabled={isLoading}
                    >
                        {isLoading ? '수정 중...' : '수정하기'}
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
                        {isLoading ? '변경 중...' : '비밀번호 변경'}
                    </button>
                    {message && <div className='profile-edit-message'>{message}</div>}
                </form>
            )}
        </div>
    );
}