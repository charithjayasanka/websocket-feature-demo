# 🔌 Node.js WebSocket Feature Showcase

A comprehensive example of WebSocket client-server communication using Node.js and the [`ws`](https://github.com/websockets/ws) library. This project is built to demonstrate nearly **all major WebSocket features** including:

- Sub-protocol negotiation
- Text, JSON, and binary message handling
- Custom headers
- Broadcast messaging
- Ping/pong (heartbeat)
- Reconnection logic
- Connection lifecycle events
- Server-enforced message size limits

## 🚀 Features

| Feature                          | Description |
|----------------------------------|-------------|
| ✅ Basic WebSocket Connection    | Establishes a `ws://` connection between client and server. |
| ✅ Sub-Protocol Negotiation      | Uses `Sec-WebSocket-Protocol` to agree on `chat` sub-protocol. |
| ✅ Text & JSON Message Support   | Sends plain text and JSON-formatted strings between client and server. |
| ✅ Binary Message Support        | Sends and receives raw binary data using `Buffer`. |
| ✅ Broadcast Messaging           | Server rebroadcasts received messages to all other clients. |
| ✅ Ping/Pong Heartbeats          | Server and client exchange ping/pong frames to detect broken connections. |
| ✅ Reconnection Handling         | Client auto-reconnects on unexpected disconnects with exponential backoff. |
| ✅ Custom HTTP Headers           | Demonstrates how to include additional headers in the handshake. |
| ✅ Payload Size Limiting         | Server enforces a 1MB max payload limit per message. |
| ✅ Graceful Connection Handling  | Handles `close`, `error`, and `upgrade` events gracefully. |

## 🧑‍💻 Getting Started

### Prerequisites

- Node.js (v14 or above)
- npm

### Installation

```bash
git clone https://github.com/charithjayasanka/websocket-feature-demo.git
cd websocket-feature-demo
npm install
