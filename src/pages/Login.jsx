import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className='login-wrap'>
      <form className="loginForm">
        <div>
          <h2>LOGO</h2>
        </div>
        <div className="login-input">
          <input
            type="text"
            className="userEmail"
            id="userEmail"
            placeholder="이메일"
          />
          <input
            type="password"
            className="password"
            id="password"
            placeholder="비밀번호"
          />
          <button id="login-btn">Login</button>
        </div>
        <Link className="signup-btn" to="/signup">회원가입</Link>
      </form>
    </div>
  );
}
