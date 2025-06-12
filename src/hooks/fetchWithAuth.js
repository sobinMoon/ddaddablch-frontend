import { logout, updateAccessToken } from './authSlice';

export const fetchWithAuth = async (url, options = {}, store) => {
  const state = store.getState();
  const token = state.auth.accessToken;
  const refreshToken = state.auth.refreshToken;

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  // access token 만료 시
  if (res.status === 401 && refreshToken) {
    const refreshRes = await fetch('/auth/login/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      store.dispatch(updateAccessToken(refreshData.accessToken));

      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${refreshData.accessToken}`,
        },
      });
    } else {
      store.dispatch(logout());
    }
  }

  return res;
};
