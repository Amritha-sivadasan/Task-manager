import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_BASE_URL;
const socket = io(API_URL, {
  transports: ["websocket"],
  withCredentials: true,
});
export default socket;
