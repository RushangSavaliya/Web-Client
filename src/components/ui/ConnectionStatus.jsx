import { useState, useEffect } from 'react';
import socket from '../../lib/socketClient';

const ConnectionStatus = () => {
    const [connectionStatus, setConnectionStatus] = useState({
        isConnected: false,
        status: 'disconnected'
    });

    useEffect(() => {
        const updateStatus = () => {
            const status = socket.getStatus();
            setConnectionStatus({
                isConnected: status.isConnected,
                status: status.isConnected ? 'connected' : 'disconnected'
            });
        };

        const handleAuthorized = () => {
            setConnectionStatus(prev => ({ ...prev, status: 'authorized' }));
        };

        const handleUnauthorized = () => {
            setConnectionStatus(prev => ({ ...prev, status: 'unauthorized' }));
        };

        const handleError = () => {
            setConnectionStatus(prev => ({ ...prev, status: 'error' }));
        };

        // Initial status check
        updateStatus();

        // Set up event listeners
        socket.on('authorized', handleAuthorized);
        socket.on('unauthorized', handleUnauthorized);
        socket.on('error', handleError);

        // Check connection status periodically
        const interval = setInterval(updateStatus, 2000);

        return () => {
            socket.off('authorized', handleAuthorized);
            socket.off('unauthorized', handleUnauthorized);
            socket.off('error', handleError);
            clearInterval(interval);
        };
    }, []);

    const getStatusColor = () => {
        switch (connectionStatus.status) {
            case 'connected':
            case 'authorized':
                return 'bg-green-500';
            case 'unauthorized':
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-yellow-500';
        }
    };

    const getStatusText = () => {
        switch (connectionStatus.status) {
            case 'connected':
                return 'Connected';
            case 'authorized':
                return 'Online';
            case 'unauthorized':
                return 'Unauthorized';
            case 'error':
                return 'Connection Error';
            default:
                return 'Connecting...';
        }
    };

    return (
        <div className="flex items-center gap-2 px-3 py-2 text-sm">
            <div
                className={`w-2 h-2 rounded-full ${getStatusColor()}`}
                title={`Connection status: ${connectionStatus.status}`}
            />
            <span className="text-gray-600 dark:text-gray-300">
                {getStatusText()}
            </span>
        </div>
    );
};

export default ConnectionStatus;
