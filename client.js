const WebSocket = require('ws');

let reconnectAttempts = 0;
let socket;

function connect() {
  // Connect to WebSocket server using 'chat' sub-protocol and custom header
  socket = new WebSocket('ws://localhost:8080/websocket', 'chat', {
    headers: {
      'X-Custom-Header': 'my-client-header' // custom metadata for server use
    }
  });

  // Event: On successful connection
  socket.on('open', () => {
    console.log('Connected to server');
    reconnectAttempts = 0;

    // Send a plain text message
    socket.send('Hello Server!');

    // Send a JSON-formatted string
    socket.send(JSON.stringify({ type: 'greet', content: 'Hello in JSON!' }));

    // Send binary data using Buffer
    const buffer = Buffer.from([0x01, 0x02, 0x03]);
    socket.send(buffer);

    // Send ping to keep connection alive every 15 seconds
    setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        console.log('Sending ping...');
        socket.ping(); // client-initiated ping
      }
    }, 15000);
  });

  // Event: When message is received from server
  socket.on('message', (data, isBinary) => {
    const content = isBinary ? data : data.toString();
    console.log('Message from server:', content);
  });

  // Event: When server sends a pong in response to ping
  socket.on('pong', () => {
    console.log('Pong received from server');
  });

  // Event: When connection is closed
  socket.on('close', (code, reason) => {
    console.warn(`Connection closed. Code: ${code}, Reason: ${reason}`);
    attemptReconnect(); // try to reconnect
  });

  // Event: On connection error
  socket.on('error', (err) => {
    console.error('Socket error:', err.message);
  });
}

// Reconnection logic with exponential backoff
function attemptReconnect() {
  if (reconnectAttempts < 5) {
    reconnectAttempts++;
    const delay = 2 ** reconnectAttempts;
    console.log(`Reconnecting in ${delay}s...`);
    setTimeout(connect, delay * 1000);
  } else {
    console.log('Max reconnection attempts reached. Exiting.');
  }
}

// Start the first connection
connect();
