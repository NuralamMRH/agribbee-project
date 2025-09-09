import { io } from 'socket.io-client';

// Initialize the socket connection
export const socket = io(process.env.HOST_API_KEY); // Replace with your socket server URL
