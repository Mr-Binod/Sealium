// notifications.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['https://vc.sealiumback.store', 'https://sealiumback.store', 'sealiumback.store', 'http://localhost:3000', 'https://verify.sealiumback.store', 'https://admin.sealiumback.store'],
    methods: ["GET", "POST"],
    credentials: true,
  },
})

export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.join(userId);
      console.log(`Client ${client.id} connected and joined room for userId: ${userId}`);
    } else {
      console.log(`Client connected: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Example: receive a message from client
  @SubscribeMessage('sendNotification')
  handleSendNotification(@MessageBody() data: { id: string, title: string, ts: number, message: string, read: boolean }) {
    console.log('Notification received:', data);
    // Broadcast to all connected clients
    this.server.emit('receiveNotification', data);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(@MessageBody() data: { message: string, userId: string }) {
    console.log('Message received:', data);
    if (data.userId) {
      this.server.to(data.userId).emit('receiveMessage', data);
    }
    else {
      this.server.emit('receiveMessage', data);
    }
  }
  // Send notification from backend (without client trigger)
  sendNotificationToAll(message: string) {
    this.server.emit('receiveNotification', { message });
  }
}