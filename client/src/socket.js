import { io } from "socket.io-client";

const URL = import.meta.env.VITE_WS_URI;

export const socket = io(URL);
