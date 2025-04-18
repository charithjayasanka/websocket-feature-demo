const WebSocket = require('ws');
const http = require('http');

// Create a basic HTTP server to handle upgrade requests for WebSocket
const server = http.createServer();

// Create a WebSocket server instance
const wss = new WebSocket.Server({
  server,
  path: "/websocket", // custom path for WebSocket endpoint
  maxPayload: 1024 * 1024, // 1MB limit on incoming messages
handleProtocols: (protocols, request) => {
  console.log("Requested protocols:", protocols);

  // Support both custom 'chat' and STOMP sub-protocols
  if (protocols.has("chat")) return "chat";
  if (protocols.has("v11.stomp")) return "v11.stomp";
  if (protocols.has("v10.stomp")) return "v10.stomp";

  return false; // reject connection if none are supported
}

});

const clients = new Set(); // to keep track of all connected clients

// Event: When a client connects
wss.on('connection', (ws, req) => {
  console.log('Client connected from', req.socket.remoteAddress);
  clients.add(ws);

  // Event: When a message is received from a client
  ws.on('message', (message, isBinary) => {
    const decoded = isBinary ? message : message.toString();
    console.log('Received:', decoded);

    // Echo the message back to the sender
    ws.send(`Server received: ${decoded}`);

    // Broadcast the message to all other connected clients
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`[Broadcast] ${decoded}`);
      }
    }
  });

  // Event: When a ping frame is received
  ws.on('ping', () => {
    console.log('Received ping');
  });

  // Event: When a pong frame is received
  ws.on('pong', () => {
    console.log('Received pong');
  });

  // Event: When a client disconnects
  ws.on('close', (code, reason) => {
    console.log(`Client disconnected. Code: ${code}, Reason: ${reason}`);
    clients.delete(ws);
  });

  // Event: On connection error
  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });

  // Server-initiated ping (heartbeat) every 10 seconds
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping(); // sends ping frame
    } else {
      clearInterval(interval);
    }
  }, 10000);
});

// Start the HTTP server and WebSocket service
server.listen(8080, () => {
  console.log('WebSocket server listening at ws://localhost:8080/websocket');
});
