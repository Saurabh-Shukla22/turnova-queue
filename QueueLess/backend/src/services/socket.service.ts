import { Server as SocketIOServer } from 'socket.io';

let ioInstance: SocketIOServer | null = null;

export const setIO = (io: SocketIOServer) => {
  ioInstance = io;
};

export const getIO = (): SocketIOServer => {
  if (!ioInstance) {
    throw new Error('Socket.IO is not initialized!');
  }
  return ioInstance;
};

export const emitQueueUpdate = (queueId: string, businessId: string, payload: any) => {
  if (!ioInstance) return;
  ioInstance.to(`queue:${queueId}`).emit('queue:update', payload);
  ioInstance.to(`business:${businessId}`).emit('queue:update', payload);
};

export const emitQueueCalled = (queueId: string, userId: string | undefined, payload: any) => {
  if (!ioInstance) return;
  ioInstance.to(`queue:${queueId}`).emit('queue:called', payload);
  if (userId) {
    ioInstance.to(`user:${userId}`).emit('queue:called', payload);
  }
};

export const emitQueueCompleted = (queueId: string, businessId: string, payload: any) => {
  if (!ioInstance) return;
  ioInstance.to(`queue:${queueId}`).emit('queue:completed', payload);
  ioInstance.to(`business:${businessId}`).emit('queue:completed', payload);
};

export const emitQueueCancelled = (queueId: string, businessId: string, payload: any) => {
  if (!ioInstance) return;
  ioInstance.to(`queue:${queueId}`).emit('queue:cancelled', payload);
  ioInstance.to(`business:${businessId}`).emit('queue:cancelled', payload);
};

export const emitQueuePaused = (queueId: string, businessId: string, reason?: string) => {
  if (!ioInstance) return;
  const payload = { queueId, isPaused: true, pauseReason: reason };
  ioInstance.to(`queue:${queueId}`).emit('queue:paused', payload);
  ioInstance.to(`business:${businessId}`).emit('queue:paused', payload);
};

export const emitQueueResumed = (queueId: string, businessId: string) => {
  if (!ioInstance) return;
  const payload = { queueId, isPaused: false };
  ioInstance.to(`queue:${queueId}`).emit('queue:resumed', payload);
  ioInstance.to(`business:${businessId}`).emit('queue:resumed', payload);
};

export const emitNotification = (userId: string, notification: any) => {
  if (!ioInstance) return;
  ioInstance.to(`user:${userId}`).emit('notification:new', notification);
};
