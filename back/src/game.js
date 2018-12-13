const fs = require('fs');
const path = require('path');

const {movies} = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../fetch-entries/data/movies.json')));

const defaults = {
  sockets: [],
  interval: 10 // Time interval between entries. In seconds.
};

class Game {
  constructor(input) {
    Object.assign(this, defaults, input);
    setInterval(addEntry.bind(this), this.interval * 1000);
  }

  addClient(socket) {
    this.sockets.push(socket);
  }
}

function addEntry() {
  if (!this.sockets.length) {
    console.log('No player connected');

    return;
  }

  const newEntryIndex = Math.floor(Math.random() * movies.length);
  console.log('new entry index', newEntryIndex);
  const entry = movies[newEntryIndex];
  // console.log('send new entry', entry);

  for (const socket of this.sockets) {
    this.addNewEntry(socket, formatEntry(entry));
  }
}

function formatEntry(entry) {
  return {
    tagLines: entry.tagLines,
    year: entry.year
  };
}

module.exports = Game;
