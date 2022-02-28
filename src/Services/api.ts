import axios from 'axios';

import localStorageConfig from 'Config/localStorage';

const getAuthToken = (): string | null => {
  const user = localStorage.getItem(localStorageConfig.user_identifier);
  if (!user) return null;
  const parsedUser = JSON.parse(user);
  if (!parsedUser.token) return null;
  return parsedUser.token;
};

const backendURL =
  process.env.NODE_ENV === 'production'
    ? 'https://wellets-backend.herokuapp.com'
    : 'http://localhost:3333';

const api = axios.create({
  baseURL: backendURL,
});

api.interceptors.request.use(config => {
  try {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

export default api;
