import React, { useState, useEffect } from 'react';
import './Signup.css';
import SERVER_URL from '../hooks/SeverUrl';
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Studentsignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        email: '',
        password: '',
        confirmPassword: '',
        verificationToken: ''
      });
    
      const [errors, setErrors] = useState({});
      const [message, setMessage] = useState('');
    
      const [emailVerified, setEmailVerified] = useState(false);
      const [emailVerificationMsg, setEmailVerificationMsg] = useState('');
    
      const [nicknameCheckMsg, setNicknameCheckMsg] = useState('');
      const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);
    
      const [isVerifying, setIsVerifying] = useState(false);
      const [verificationCheckInterval, setVerificationCheckInterval] = useState(null);
    
      const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@sookmyung\.ac\.kr$/;
        return emailRegex.test(email);
      };
    
      const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        if (name === 'nickname') {
          setIsNicknameAvailable(null);
          setNicknameCheckMsg('');
        }
        
        if (name === 'email') {
          if (!value) {
            setErrors(prev => ({ ...prev, email: '이메일은 필수입니다.' }));
          } else if (!isValidEmail(value)) {
            setErrors(prev => ({ ...prev, email: '숙명여대 이메일(@sookmyung.ac.kr)만 사용 가능합니다.' }));
          } else {
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.email;
              return newErrors;
            });
          }
        } else if (errors[name]) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
      };
    
      const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = '이름은 필수입니다.';
        if (!formData.email) newErrors.email = '이메일은 필수입니다.';
        else if (!isValidEmail(formData.email)) newErrors.email = '숙명여대 이메일(@sookmyung.ac.kr)만 사용 가능합니다.';
        if (!formData.password) newErrors.password = '비밀번호는 필수입니다.';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        if (!emailVerified) newErrors.emailVerified = '이메일 인증을 완료해주세요.';
        return newErrors;
      };
    
      const sendVerificationEmail = async () => {
        setEmailVerificationMsg('');
        setIsVerifying(true);
        try {
            const res = await fetch(`${SERVER_URL}/api/v1/user/sign-up/send-verification-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: formData.email })
            });
    
            const data = await res.json();
            console.log(data);

            if (!res.ok) {
                throw new Error(data.message || '서버 응답 오류');
            }
    
            console.log('서버 응답:', data);
            setEmailVerificationMsg('인증 메일이 발송되었습니다. 이메일을 확인한 후 토큰을 입력해주세요.');
        } catch (err) {
            console.error('이메일 인증 요청 중 오류:', err);
            setEmailVerificationMsg(`인증 메일 전송 중 오류 발생: ${err.message}`);
        } finally {
            setIsVerifying(false);
        }
    };
    
    const checkNicknameDuplicate = async () => {
        if (!formData.nickname) {
          setNicknameCheckMsg('닉네임을 입력해주세요');
          setIsNicknameAvailable(false);
          return;
        }
    
        try {
          const res = await fetch(`${SERVER_URL}/api/v1/user/sign-up/duplicate-check?nickname=${encodeURIComponent(formData.nickname)}`);
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('서버 응답 오류:', res.status, errorData);
            throw new Error(errorData.message || `서버 응답 오류 (${res.status})`);
          }
          const data = await res.json();
          if (data.duplicate === false) {
            setNicknameCheckMsg('사용 가능한 닉네임입니다.');
            setIsNicknameAvailable(true);
          } else {
            setNicknameCheckMsg('이미 사용 중인 닉네임입니다.');
            setIsNicknameAvailable(false);
          }
        } catch (err) {
          console.error('닉네임 중복 확인 오류:', err);
          setNicknameCheckMsg(`닉네임 중복 확인 중 오류 발생: ${err.message}`);
          setIsNicknameAvailable(false);
        }
      };
    
      const navigate = useNavigate();
      
      const handleSubmit = async e => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      
        try {
          const res = await fetch(`${SERVER_URL}/api/v1/user/sign-up/student`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
      
          let data;
          const contentType = res.headers.get("Content-Type");
          if (contentType && contentType.includes("application/json")) {
            data = await res.json();
          } else {
            const text = await res.text();
            data = { message: text };  // fallback
          }
      
          console.log(data);
      
          if (res.status === 201) {
            setMessage(data.message);
            setErrors({});
            navigate('/login');
            alert(data.message);
          } else if (res.status === 409) {
            setMessage(data.message || '이미 등록된 이메일입니다');
            setErrors({});
            alert(data.message);
          } else {
            setMessage(data.message || '오류 발생');
          }
        } catch (error) {
          setMessage('서버 오류 발생');
        }
      };
      
    
      const verifyEmailToken = async () => {
        if (!formData.verificationToken) {
            setEmailVerificationMsg('인증 토큰을 입력해주세요.');
            return;
        }

        try {
            const res = await fetch(`${SERVER_URL}/api/v1/user/sign-up/verify-email?token=${formData.verificationToken}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
            });

            const data = await res.json();
            
            if (data.success) {
                setEmailVerified(true);
                setEmailVerificationMsg(data.message || '이메일 인증이 완료되었습니다!');
            } else {
                setEmailVerificationMsg(data.message || '인증에 실패했습니다.');
            }
        } catch (err) {
            console.error('이메일 인증 중 오류:', err);
            setEmailVerificationMsg('인증 처리 중 오류가 발생했습니다.');
        }
    };
    
      return (
        <form className="student-signup" onSubmit={handleSubmit}>
          <label>이름*</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="이름을 입력해주세요" />
          {errors.name && <p className="error">{errors.name}</p>}
    
          <label>닉네임 (선택)</label>
          <div className="row">
            <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} placeholder="닉네임을 입력해주세요" />
            <button type="button" onClick={checkNicknameDuplicate}>중복 확인</button>
          </div>
          {nicknameCheckMsg && 
          <p className={isNicknameAvailable ? 'nickname-info' : 'error'}>
            {isNicknameAvailable ? <FaRegCheckCircle /> : <FaRegTimesCircle />}
            {nicknameCheckMsg}
          </p>}
    
          <label>이메일*</label>
          <div className="email-verification-container">
            <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                disabled={isVerifying}
                placeholder="example@sookmyung.ac.kr"
            />
            <button 
                type="button" 
                onClick={sendVerificationEmail}
                disabled={isVerifying || !formData.email || !isValidEmail(formData.email)}
            >
                {isVerifying ? '인증 중...' : '인증메일 전송'}
            </button>
          </div>
          {errors.email && <p className="error">{errors.email}</p>}
          {emailVerificationMsg && (
            <p className={`verification-message ${emailVerified ? 'success' : 'info'}`}>
                {emailVerificationMsg}
            </p>
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
                <button
                    type="button"
                    onClick={verifyEmailToken}
                    disabled={!formData.verificationToken}
                >
                    인증하기
                </button>
            </div>
          )}
          {errors.emailVerified && <p className="error">{errors.emailVerified}</p>}
    
          <label>비밀번호*</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호를 입력해주세요" />
          {errors.password && <p className="error">{errors.password}</p>}
    
          <label>비밀번호 확인*</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="비밀번호를 다시 입력해주세요" />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
    
          <button type="submit">가입하기</button>
    
          {/* {message && <p className="message">{message}</p>} */}
        </form>
      );
};

export default Studentsignup;

//(409로 에러나면 이메일 중복)