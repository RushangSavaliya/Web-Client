// File: src/lib/socket.js

import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL, {
    auth: {
        token: localStorage.getItem("token"),
    },
});

export default socket;
