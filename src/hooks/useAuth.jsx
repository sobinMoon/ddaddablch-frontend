// src/hooks/useAuth.js
import { useState, useEffect } from 'react';

function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // token이 존재하면 로그인 상태로 간주
  }, []);

  return { isLoggedIn };
}

export default useAuth;
