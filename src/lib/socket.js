import { io } from "socket.io-client";

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect(token) {
    // Disconnect existing socket if any
    this.disconnect();

    if (!token) {
      console.warn("No token provided for socket connection");
      return;
    }

    try {
      this.socket = io(import.meta.env.VITE_SERVER_URL, {
        auth: {
          token: token,
        },
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
      });

      this.setupEventListeners();
      console.log("Socket connection initiated");
    } catch (error) {
      console.error("Socket connection failed:", error);
    }
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket.id);
      this.isConnected = true;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.isConnected = false;
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
      this.isConnected = true;
    });

    this.socket.on("reconnect_error", (error) => {
      console.error("Socket reconnection failed:", error);
    });

    // Re-attach custom listeners
    this.listeners.forEach((callback, event) => {
      this.socket.on(event, callback);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log("Socket disconnected");
    }
  }

  on(event, callback) {
    // Store the listener for re-attachment on reconnection
    this.listeners.set(event, callback);
    
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    // Remove from stored listeners
    this.listeners.delete(event);
    
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn("Socket not connected, cannot emit:", event);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id || null,
    };
  }
}

// Create singleton instance
const socketManager = new SocketManager();

// Export the manager instance with socket-like interface
export default {
  connect: (token) => socketManager.connect(token),
  disconnect: () => socketManager.disconnect(),
  on: (event, callback) => socketManager.on(event, callback),
  off: (event, callback) => socketManager.off(event, callback),
  emit: (event, data) => socketManager.emit(event, data),
  getStatus: () => socketManager.getConnectionStatus(),
};
