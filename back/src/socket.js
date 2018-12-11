const Game = require('./game');

function socketHandler(io) {
  if (!io) {
    throw new Error('no io');
  }
  io.on('connection', handleConnection);
}

async function handleConnection(socket) {
  console.log('A user is connected');

  const game = new Game({
    socket,
    addNewEntry: onNewEntry
  });

  game.init();
}

function onNewEntry(socket, entry) {
  socket.emit('server:new_entry', entry);
}

module.exports = socketHandler;
