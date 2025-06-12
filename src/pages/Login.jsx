import React, { useState, useContext } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import SERVER_URL from '../hooks/SeverUrl';
import { IoSnow } from 'react-icons/io5';

export default function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('student');
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
      const endpoint =
        userType === 'organization' ? '/auth/login/org' : '/auth/login/student';

      const res = await fetch(`${SERVER_URL}${endpoint}`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);


        if (userType === 'student') {
          navigate('/');
        } else {
          navigate('/organization/home');
        }
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
    <div className='login-container'>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-header">
        <a href="/" className="navbar-logo"
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: '800',
                            color: '#0071ce',
                            textDecoration: 'none',
                            fontFamily: '"Fauna One", serif',
                            letterSpacing: '-0.03em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.1rem',
                            justifyContent: 'center',
                            marginBottom: '1.2rem',
                            marginTop: '0.5rem',
                            
                        }}
                    >
                        <IoSnow />
                        SOOKCHAIN
                    </a>
        </div>
        <div className="login-type-buttons">
          <button
            type="button"
            className={userType === 'student' ? 'login-type-active' : 'login-type-inactive'}
            onClick={() => setUserType('student')}
          >
            🧑‍🎓학생 로그인
          </button>
          <button
            type="button"
            className={userType === 'organization' ? 'login-type-active' : 'login-type-inactive'}
            onClick={() => setUserType('organization')}
          >
            ❤️수혜자 로그인
          </button>
        </div>
        <div className="login-input-group">
          <input
            type="email"
            className="login-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일"
            required
          />
          <input
            type="password"
            className="login-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
            required
          />
          {error && <p className="login-error-message">{error}</p>}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : 'Login'}
          </button>
        </div>
        <Link className="login-signup-link" to="/signup">회원가입</Link>
      </form>
    </div>
  );
}
