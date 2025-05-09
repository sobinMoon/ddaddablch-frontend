import React, { useState } from 'react';
import './Signup.css';
import Studentsignup from './Studentsignup';
const Signup = () => {
  const [userType, setUserType] = useState('student');

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <div className="type-buttons">
        <button
          className={userType === 'student' ? 'active' : 'inactive'}
          onClick={() => setUserType('student')}
        >
          학생 회원
        </button>
        <button
          className={userType === 'organization' ? 'active' : 'inactive'}
          onClick={() => setUserType('organization')}
        >
          단체 회원
        </button>
      </div>

      {userType === 'student' ? <Studentsignup/>:<div>aa</div>}
    </div>
  );
};

export default Signup;
