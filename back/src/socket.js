const Game = require('./game');

const game = new Game({
  addNewEntry: onNewEntry
});

function socketHandler(io) {
  if (!io) {
    throw new Error('no io');
  }
  io.on('connection', handleConnection);
}

async function handleConnection(socket) {
  console.log('A user is connected');

  game.addClient(socket);
}

function onNewEntry(socket, entry) {
  socket.emit('server:new_entry', entry);
}

module.exports = socketHandler;
