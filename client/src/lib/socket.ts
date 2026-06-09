import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import { SOCKET_URL } from '../utils/constants';

const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: (callback) => {
    callback({
      token: Cookies.get('access_token')
    });
  }
});

export default socket;
