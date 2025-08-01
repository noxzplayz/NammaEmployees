import { NextRequest } from 'next/server';
import { Server } from 'socket.io';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

let io;

export async function GET(req: NextRequest) {
  if (!io) {
    const server = new Server({
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io = server;

    io.on('connection', (socket) => {
      console.log('a user connected:', socket.id);

      socket.on('admin-action', (data) => {
        // Broadcast the admin action to all clients except sender
        socket.broadcast.emit('update-action', data);
      });

      socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
      });
    });
  }

  return NextResponse.json({ message: 'Socket server running' });
}
