// File: src/lib/socketClient.js

class SocketManager {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.listeners = new Map();
        this.token = null;
    }

    connect(token) {
        this.disconnect();

        if (!token) {
            console.warn("No token provided for socket connection");
            return;
        }

        this.token = token;
        const url = new URL(import.meta.env.VITE_SERVER_URL.replace(/^http/, "ws"));
        url.searchParams.append("token", token);

        try {
            this.socket = new WebSocket(url.toString());

            this.socket.onopen = () => {
                this.isConnected = true;
                console.log("WebSocket connected");
                this.listeners.forEach(() => {
                    // No event registration for custom events in WebSocket, handled in onmessage
                });
            };

            this.socket.onclose = (event) => {
                this.isConnected = false;
                console.log("WebSocket disconnected:", event.reason);
            };

            this.socket.onerror = (error) => {
                this.isConnected = false;
                console.error("WebSocket error:", error);
            };

            this.socket.onmessage = (message) => {
                try {
                    const { event, data } = JSON.parse(message.data);
                    const callback = this.listeners.get(event);
                    if (callback) callback(data);
                } catch (e) {
                    console.warn("WebSocket message parse error:", e);
                }
            };

            console.log("WebSocket connection initiated");
        } catch (error) {
            console.error("WebSocket connection failed:", error);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.isConnected = false;
            console.log("WebSocket disconnected");
        }
    }

    on(event, callback) {
        this.listeners.set(event, callback);
    }

    off(event) {
        this.listeners.delete(event);
    }

    emit(event, data) {
        if (this.socket && this.isConnected) {
            this.socket.send(JSON.stringify({ event, data }));
        } else {
            console.warn("WebSocket not connected, cannot emit:", event);
        }
    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            socketId: null, // WebSocket does not have socket.id
        };
    }
}

const socketManager = new SocketManager();

export default {
    connect: (token) => socketManager.connect(token),
    disconnect: () => socketManager.disconnect(),
    on: (event, callback) => socketManager.on(event, callback),
    off: (event) => socketManager.off(event),
    emit: (event, data) => socketManager.emit(event, data),
    getStatus: () => socketManager.getConnectionStatus(),
};
