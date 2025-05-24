import React, { useState } from 'react';
import './Signup.css';
import SERVER_URL from '../hooks/SeverUrl';

export default function Orgsignup() {
  const [formData, setFormData] = useState({
    name: '',
    businessNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    walletAddress: '',
    verificationToken: '',
    description: '',
    profileImage: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerificationMsg, setEmailVerificationMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result });
        if (errors.profileImage) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.profileImage;
            return newErrors;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = '기관명은 필수입니다.';
    if (!formData.businessNumber) newErrors.businessNumber = '사업자 등록번호는 필수입니다.';
    if (!formData.email) newErrors.email = '이메일은 필수입니다.';
    else if (!isValidEmail(formData.email)) newErrors.email = '이메일 형식이 올바르지 않습니다.';
    if (!formData.password) newErrors.password = '비밀번호는 필수입니다.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    if (!emailVerified) newErrors.emailVerified = '이메일 인증을 완료해주세요.';
    if (!formData.description) newErrors.description = '소개글은 필수입니다.';
    if (!formData.profileImage) newErrors.profileImage = '프로필 이미지는 필수입니다.';
    return newErrors;
  };

  const sendVerificationEmail = async () => {
    setEmailVerificationMsg('');
    setIsVerifying(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/org/send-verification-email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) throw new Error(data.message || '서버 응답 오류');
      console.log('서버 응답:', data);
      setEmailVerificationMsg('인증 메일이 발송되었습니다. 이메일을 확인한 후 토큰을 입력해주세요.');
    } catch (err) {
      console.error('이메일 인증 요청 중 오류:', err);
      setEmailVerificationMsg(`인증 메일 전송 중 오류 발생: ${err.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyEmailToken = async () => {
    if (!formData.verificationToken) {
      setEmailVerificationMsg('인증 토큰을 입력해주세요.');
      return;
    }

    try {
      const res = await fetch(`${SERVER_URL}/api/org/verify-email?token=${formData.verificationToken}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setEmailVerified(true);
        setEmailVerificationMsg(data.message || '이메일 인증이 완료되었습니다!');
      } else {
        setEmailVerificationMsg(data.message || '인증에 실패했습니다.');
      }
    } catch (err) {
      setEmailVerificationMsg('인증 처리 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch(`${SERVER_URL}/api/org/sign-up/organization`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.status === 201) {
        setMessage(data.message);
        setErrors({});
      } else {
        setMessage(data.message || '오류 발생');
      }
    } catch {
      setMessage('서버 오류 발생');
    }
  };

  return (
    <form className="student-signup" onSubmit={handleSubmit}>
      <label>기관명*</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="기관명을 입력해주세요" />
      {errors.name && <p className="error">{errors.name}</p>}

      <label>사업자 등록번호*</label>
      <input type="text" name="businessNumber" value={formData.businessNumber} onChange={handleChange} placeholder="사업자 등록번호를 입력해주세요" />
      {errors.businessNumber && <p className="error">{errors.businessNumber}</p>}

      <label>소개글*</label>
      <textarea 
        className='org-description-textarea'
        name="description" 
        value={formData.description} 
        onChange={handleChange} 
        placeholder="소개글을 입력해주세요"
        rows="4"
      />
      {errors.description && <p className="error">{errors.description}</p>}

      <label>프로필 이미지*</label>
      <div className="profileimage-upload-wrapper">
        {formData.profileImage && (
          <img src={formData.profileImage} alt="프로필 미리보기" className="profileimage-preview" />
        )}
        <label htmlFor="profileImageInput" className="profileimage-upload">
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
      {errors.profileImage && <p className="error">{errors.profileImage}</p>}

      <label>이메일*</label>
      <div className="email-verification-container">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isVerifying}
          placeholder="example@organization.com"
        />
        <button 
          type="button" 
          onClick={sendVerificationEmail} 
          disabled={isVerifying || !formData.email || !isValidEmail(formData.email)}
        >
          {isVerifying ? '전송 중...' : '인증메일 전송'}
        </button>
      </div>
      {errors.email && <p className="error">{errors.email}</p>}

      {emailVerificationMsg && (
        <p className={`verification-message ${emailVerified ? 'success' : 'info'}`}>{emailVerificationMsg}</p>
      )}
      {!emailVerified && (
        <div className="token-verification-container">
          <input
            type="text"
            name="verificationToken"
            value={formData.verificationToken}
            onChange={handleChange}
            placeholder="인증 토큰을 입력해주세요"
          />
          <button type="button" onClick={verifyEmailToken} disabled={!formData.verificationToken}>
            인증하기
          </button>
        </div>
      )}
      {errors.emailVerified && <p className="error">{errors.emailVerified}</p>}

      <label>지갑 주소 (선택)</label>
      <input type="text" name="walletAddress" value={formData.walletAddress} onChange={handleChange} placeholder="지갑 주소를 입력해주세요" />

      <label>비밀번호*</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호를 입력해주세요" />
      {errors.password && <p className="error">{errors.password}</p>}

      <label>비밀번호 확인*</label>
      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="비밀번호를 다시 입력해주세요" />
      {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

      <button type="submit">가입하기</button>

      {message && <p className="message">{message}</p>}
    </form>
  );
}
