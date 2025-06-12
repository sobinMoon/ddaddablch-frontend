import React, { useState } from 'react';
import './Signup.css';
import SERVER_URL from '../hooks/SeverUrl';
import { useNavigate } from 'react-router-dom';

export default function Orgsignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    businessNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  const formatBusinessNumber = (value) => {
    // 숫자만 추출
    const numbers = value.replace(/[^0-9]/g, '');
    
    // 10자리로 제한
    const limitedNumbers = numbers.slice(0, 10);
    
    // 형식에 맞게 포맷팅
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 5) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 5)}-${limitedNumbers.slice(5)}`;
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    
    if (name === 'businessNumber') {
      const formattedValue = formatBusinessNumber(value);
      setFormData({ ...formData, [name]: formattedValue });
      
      // 형식 검증
      if (formattedValue && !/^\d{3}-\d{2}-\d{5}$/.test(formattedValue)) {
        setErrors(prev => ({ ...prev, businessNumber: '사업자 등록번호 형식이 올바르지 않습니다. (예: 000-00-00000)' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.businessNumber;
          return newErrors;
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
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
    if (formData.businessNumber && !/^[\d]{3}-[\d]{2}-[\d]{5}$/.test(formData.businessNumber)) {
      newErrors.businessNumber = '사업자 등록번호 형식이 올바르지 않습니다. (예: 000-00-00000)';
    }
    if (!formData.email) newErrors.email = '이메일은 필수입니다.';
    else if (!isValidEmail(formData.email)) newErrors.email = '이메일 형식이 올바르지 않습니다.';
    if (!formData.password) newErrors.password = '비밀번호는 필수입니다.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    if (!emailVerified) newErrors.emailVerified = '이메일 인증을 완료해주세요.';
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
      // JSON 데이터 생성
      const requestData = {
        name: formData.name,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        businessNumber: formData.businessNumber,
        walletAddress: formData.walletAddress,
        email: formData.email,
        description: formData.description,
        profileImage: ""
      };

      // FormData 생성
      const formDataToSend = new FormData();
      
      // JSON 데이터를 문자열로 변환하여 추가
      formDataToSend.append('request', new Blob([JSON.stringify(requestData)], {
        type: 'application/json'
      }));
      
      // 이미지가 있다면 추가
      if (formData.profileImage) {
        // Base64 이미지를 Blob으로 변환
        const base64Response = await fetch(formData.profileImage);
        const blob = await base64Response.blob();
        formDataToSend.append('image', blob, 'profile.jpg');
      }

      const res = await fetch(`${SERVER_URL}/api/org/sign-up/organization`, {
        method: 'POST',
        body: formDataToSend
      });

      const data = await res.json();
      console.log("data", data);
      if (res.status === 201) {
        setMessage(data.message);
        setErrors({});
        alert(data.message);
        navigate('/login');
      } else if (res.status === 409) {
        setMessage(data.message || '이미 등록된 이메일입니다');
        setErrors({});
        alert(data.message);
      } else {
        setMessage(data.message || '오류 발생');
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      setMessage('서버 오류 발생');
    }
  };

  return (
    <form className="student-signup" onSubmit={handleSubmit}>
      <label>기관명*</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="기관명을 입력해주세요" />
      {errors.name && <p className="error">{errors.name}</p>}

      <label>사업자 등록번호 (선택)</label>
      <input 
        type="text" 
        name="businessNumber" 
        value={formData.businessNumber} 
        onChange={handleChange} 
        placeholder="000-00-00000"
        maxLength="12"
      />
      {errors.businessNumber && <p className="error">{errors.businessNumber}</p>}

      <label>소개글(선택)</label>
      <textarea 
        className='org-description-textarea'
        name="description" 
        value={formData.description} 
        onChange={handleChange} 
        placeholder="소개글을 입력해주세요"
        rows="4"
      />

      <label>프로필 이미지(선택)</label>
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
}
