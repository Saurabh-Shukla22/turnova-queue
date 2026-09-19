import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { initSocketServer } from './config/socket.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect Database
    await connectDB();

    // 2. Initialize App & HTTP Server
    const app = createApp();
    const server = http.createServer(app);

    // 3. Initialize Socket.IO Server
    const io = initSocketServer(server);

    // 4. Start Listening
    server.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 Turnova Backend API Server Running!`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`⚡ Socket.IO Ready on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=========================================`);
    });

    // Graceful shutdown handling
    const shutdown = () => {
      console.log('Received shutdown signal, closing HTTP & Socket server...');
      server.close(() => {
        console.log('Server closed successfully.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start Turnova server:', error);
    process.exit(1);
  }
};

startServer();
