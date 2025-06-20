// File: src/lib/socket.js

import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
    auth: {
        token: localStorage.getItem("token"),
    },
});

export default socket;
