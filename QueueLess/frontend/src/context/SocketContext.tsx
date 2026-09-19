'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinQueueRoom: (queueId: string) => void;
  leaveQueueRoom: (queueId: string) => void;
  joinBusinessRoom: (businessId: string) => void;
  leaveBusinessRoom: (businessId: string) => void;
  playChime: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play synthetic pleasant chime without needing external mp3 asset
  const playChime = () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Pleasant dual chime chord
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.3); // E5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, now);
      osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.3); // G5

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.8);
      osc2.stop(now + 0.8);
    } catch {
      // Audio playback might be restricted until user interaction
    }
  };

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    const s = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
    });

    s.on('connect', () => {
      setIsConnected(true);
      console.log('[Socket] Connected to server, ID:', s.id);

      if (user?.id) {
        s.emit('user:join', user.id);
      }
    });

    s.on('disconnect', () => {
      setIsConnected(false);
      console.log('[Socket] Disconnected from server');
    });

    // Auto chime when direct user turn is called
    s.on('queue:called', () => {
      playChime();
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [user?.id]);

  const joinQueueRoom = (queueId: string) => {
    if (socket && queueId) {
      socket.emit('queue:join_room', queueId);
    }
  };

  const leaveQueueRoom = (queueId: string) => {
    if (socket && queueId) {
      socket.emit('queue:leave_room', queueId);
    }
  };

  const joinBusinessRoom = (businessId: string) => {
    if (socket && businessId) {
      socket.emit('business:join_room', businessId);
    }
  };

  const leaveBusinessRoom = (businessId: string) => {
    if (socket && businessId) {
      socket.emit('business:leave_room', businessId);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinQueueRoom,
        leaveQueueRoom,
        joinBusinessRoom,
        leaveBusinessRoom,
        playChime,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
