import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { setIO } from '../services/socket.service.js';

export const initSocketServer = (server: HttpServer): SocketIOServer => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

  const io = new SocketIOServer(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
          origin === clientUrl ||
          origin === 'http://localhost:3000' ||
          origin === 'http://127.0.0.1:3000' ||
          origin.endsWith('.vercel.app')
        ) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join specific user room for targeted notifications
    socket.on('user:join', (userId: string) => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined user:${userId}`);
      }
    });

    // Join live queue room
    socket.on('queue:join_room', (queueId: string) => {
      if (queueId) {
        socket.join(`queue:${queueId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined queue:${queueId}`);
      }
    });

    // Leave live queue room
    socket.on('queue:leave_room', (queueId: string) => {
      if (queueId) {
        socket.leave(`queue:${queueId}`);
        console.log(`[Socket.IO] Socket ${socket.id} left queue:${queueId}`);
      }
    });

    // Join business dashboard room
    socket.on('business:join_room', (businessId: string) => {
      if (businessId) {
        socket.join(`business:${businessId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined business:${businessId}`);
      }
    });

    socket.on('business:leave_room', (businessId: string) => {
      if (businessId) {
        socket.leave(`business:${businessId}`);
        console.log(`[Socket.IO] Socket ${socket.id} left business:${businessId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  setIO(io);
  return io;
};
