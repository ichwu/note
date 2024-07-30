import { Server as WebSocketServer } from 'ws';

class WebSocketService {
    private wss: WebSocketServer;

    constructor(port: number) {
        this.wss = new WebSocketServer({ port });

        this.wss.on('connection', ws => {
            console.log('客户端已连接');

            ws.on('message', message => {
                console.log(`收到消息：${message}`);
            });

            ws.on('close', () => {
                console.log('客户端已断开连接');
            });
        });
    }

    notifyClients(articleId: string) {
        this.wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                console.log('通知信息：', articleId)
                client.send(JSON.stringify({ type: 'update', payload: articleId }));
            }
        });
    }
}

export default WebSocketService;
