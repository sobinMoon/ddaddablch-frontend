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
    verificationToken: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerificationMsg, setEmailVerificationMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = '기관명은 필수입니다.';
    if (!formData.businessNumber) newErrors.businessNumber = '사업자 등록번호는 필수입니다.';
    if (!formData.email) newErrors.email = '이메일은 필수입니다.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '이메일 형식이 올바르지 않습니다.';
    if (!formData.password) newErrors.password = '비밀번호는 필수입니다.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    if (!emailVerified) newErrors.emailVerified = '이메일 인증을 완료해주세요.';
    return newErrors;
  };

  const sendVerificationEmail = async () => {
    setEmailVerificationMsg('');
    setIsVerifying(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/v1/org/sign-up/send-verification-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '서버 응답 오류');
      setEmailVerificationMsg('인증 메일이 발송되었습니다. 이메일을 확인한 후 토큰을 입력해주세요.');
    } catch (err) {
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
      const res = await fetch(`${SERVER_URL}/api/v1/org/verify-email?token=${formData.verificationToken}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include'
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
      const res = await fetch(`${SERVER_URL}/api/v1/org/sign-up/organization`, {
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
        <button type="button" onClick={sendVerificationEmail} disabled={isVerifying || !formData.email}>
          {isVerifying ? '인증 중...' : '인증메일 전송'}
        </button>
      </div>
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
      {errors.email && <p className="error">{errors.email}</p>}
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
