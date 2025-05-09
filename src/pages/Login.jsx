import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

// 서버 URL을 상수로 정의
const SERVER_URL = "http://10.101.48.92:8080";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${SERVER_URL}/auth/login/student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        // 토큰을 로컬 스토리지에 저장
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // 로그인 성공 시 홈페이지로 이동
        navigate('/');
      } else {
        setError(data.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      console.error('로그인 중 오류:', err);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='login-wrap'>
      <form className="loginForm" onSubmit={handleSubmit}>
        <div>
          <h2>LOGO</h2>
        </div>
        <div className="login-input">
          <input
            type="email"
            className="userEmail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일"
            required
          />
          <input
            type="password"
            className="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button 
            type="submit" 
            id="login-btn"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : 'Login'}
          </button>
        </div>
        <Link className="signup-btn" to="/signup">회원가입</Link>
      </form>
    </div>
  );
}
