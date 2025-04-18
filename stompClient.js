const { Client } = require('@stomp/stompjs');
const WebSocket = require('ws'); // required for Node.js

// Monkey patch WebSocket for stompjs in Node
global.WebSocket = WebSocket;

// STOMP client setup
const stompClient = new Client({
  brokerURL: 'ws://localhost:8080/websocket', // STOMP endpoint
  connectHeaders: {
    login: 'user',
    passcode: 'pass'
  },
  reconnectDelay: 5000,
  debug: function (str) {
    console.log('[STOMP DEBUG]', str);
  },
  onConnect: function () {
    console.log('✅ STOMP client connected');

    // Subscribe to a topic (not natively supported by our raw WS server, just for demonstration)
    stompClient.subscribe('/topic/sample', (message) => {
      console.log('📥 Received via STOMP:', message.body);
    });

    // Send a message to server
    stompClient.publish({
      destination: '/topic/sample',
      body: 'Hello from STOMP client!'
    });
  },
  onStompError: function (frame) {
    console.error('❌ STOMP error', frame);
  }
});

// Connect
stompClient.activate();
