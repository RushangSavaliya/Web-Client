// ==============================
// Imports
// ==============================
import { io } from "socket.io-client";

// ==============================
// Socket Initialization
// ==============================
const socket = io(import.meta.env.VITE_SERVER_URL, {
    auth: {
        token: localStorage.getItem("token"),
    },
});

// ==============================
// Export
// ==============================
export default socket;
