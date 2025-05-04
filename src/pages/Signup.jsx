import React, { useState } from 'react';
import './Signup.css';

const Signup = () => {
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    emailCode: '',
    password: '',
    confirmPassword: '',
    orgName: '',
    businessNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [emailVerified, setEmailVerified] = useState(false);

  const handleTypeChange = (type) => {
    setUserType(type);
    setErrors({});
    setFormData({
      email: '',
      emailCode: '',
      password: '',
      confirmPassword: '',
      orgName: '',
      businessNumber: '',
    });
    setEmailVerified(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{6,}$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = '유효한 이메일을 입력하세요.';
    }

    if (userType === 'student' && !emailVerified) {
      newErrors.emailCode = '이메일 인증을 완료하세요.';
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (userType === 'organization') {
      if (!formData.orgName.trim()) {
        newErrors.orgName = '단체명을 입력하세요.';
      }
      if (!formData.businessNumber.trim()) {
        newErrors.businessNumber = '사업자 등록번호를 입력하세요.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailVerify = () => {
    if (formData.email) {
      alert('인증 이메일이 발송되었습니다.');
      setEmailVerified(true); // 실제에선 백엔드 응답에 따라 처리
    } else {
      setErrors((prev) => ({ ...prev, email: '이메일을 먼저 입력하세요.' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert('회원가입 성공');
      // 백엔드 요청 코드 추가 가능
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <div className="type-buttons">
        <button
          className={userType === 'student' ? 'active' : 'inactive'}
          onClick={() => handleTypeChange('student')}
        >
          학생 회원
        </button>
        <button
          className={userType === 'organization' ? 'active' : 'inactive'}
          onClick={() => handleTypeChange('organization')}
        >
          단체 회원
        </button>
      </div>

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label>이메일</label>
          <input
            type="email"
            name="email"
            placeholder="이메일을 입력해주세요"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        {userType === 'student' && (
          <div className="form-group email-verify">
            <button type="button" onClick={handleEmailVerify}>
              인증메일 보내기
            </button>
            {errors.emailCode && <p className="error">{errors.emailCode}</p>}
          </div>
        )}

        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            placeholder="비밀번호를 입력해주세요 (최소 6자 이상)"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="비밀번호를 다시 입력해주세요"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>

        {userType === 'organization' && (
          <>
            <div className="form-group">
              <label>단체명</label>
              <input
                type="text"
                name="orgName"
                placeholder="단체명을 입력해주세요"
                value={formData.orgName}
                onChange={handleChange}
              />
              {errors.orgName && <p className="error">{errors.orgName}</p>}
            </div>

            <div className="form-group">
              <label>사업자 등록번호</label>
              <input
                type="text"
                name="businessNumber"
                placeholder="사업자 등록번호를 입력해주세요"
                value={formData.businessNumber}
                onChange={handleChange}
              />
              {errors.businessNumber && <p className="error">{errors.businessNumber}</p>}
            </div>
          </>
        )}

        <button type="submit" className="submit-button">가입하기</button>
      </form>
    </div>
  );
};

export default Signup;
