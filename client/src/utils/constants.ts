const isDev = import.meta.env.DEV;

export const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || (isDev ? 'http://localhost:5000/api' : '');
export const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_URL || (isDev ? 'http://localhost:5000' : '');
export const CLOUD_NAME = import.meta.env.VITE_APP_CLOUD_NAME;
export const UPLOAD_PRESET = import.meta.env.VITE_APP_UPLOAD_PRESET;

export const NO_AVATAR =
  'https://res.cloudinary.com/dtzs4c2uv/image/upload/v1666326774/noavatar_rxbrbk.png';

export const NO_AVATAR_CHANNEL =
  'https://res.cloudinary.com/dtzs4c2uv/image/upload/v1681810456/group2_zth3wl.png';
