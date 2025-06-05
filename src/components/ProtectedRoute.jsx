import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import SERVER_URL from '../hooks/SeverUrl';

export default function ProtectedRoute({ children, allowedRoles }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${SERVER_URL}/api/v1/auth/me`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.status === 401) {
          // 토큰이 만료된 경우 refresh token으로 재발급 시도
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            setIsLoading(false);
            return;
          }

          const refreshResponse = await fetch(`${SERVER_URL}/api/v1/auth/login/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
          });

          if (refreshResponse.ok) {
            const { accessToken: newAccessToken } = await refreshResponse.json();
            localStorage.setItem('accessToken', newAccessToken);

            // 새로운 토큰으로 다시 사용자 정보 요청
            const newResponse = await fetch(`${SERVER_URL}/api/v1/auth/me`, {
              headers: {
                'Authorization': `Bearer ${newAccessToken}`
              }
            });

            if (newResponse.ok) {
              const userData = await newResponse.json();
              setIsAuthenticated(true);
              setUserRole(userData.role);
            }
          }
        } else if (response.ok) {
          const userData = await response.json();
          setIsAuthenticated(true);
          setUserRole(userData.role);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // 권한이 없는 경우 역할에 따라 다른 페이지로 리다이렉트
    if (userRole === 'ROLE_STUDENT') {
      return <Navigate to="/" replace />;
    } else if (userRole === 'ROLE_ORGANIZATION') {
      return <Navigate to="/organization/home" replace />;
    }
    // 기타 역할의 경우 메인 페이지로 리다이렉트
    return <Navigate to="/" replace />;
  }

  return children;
} 