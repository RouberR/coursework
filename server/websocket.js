const ws = require('ws');

const wss = new ws.Server(
  {
    port: 5001,
  },
  () => console.log('Server started on 5001'),
);

wss.on('connection', function connection(ws) {
  ws.on('message', function (message) {
    message = JSON.parse(message);
    switch (message.event) {
      case 'message': {
        broadcastMessage(message);
        break;
      }
      case 'connection': {
        broadcastConnection(message);
        break;
      }
    }
  });
});

const broadcastMessage = (message) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
};

const broadcastConnection = (message) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
};
