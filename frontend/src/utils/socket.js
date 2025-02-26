import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  withCredentials: true, // Important for cross-origin requests
});

export default socket;