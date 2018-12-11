const fs = require('fs');
const path = require('path');

const {movies} = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../fetch-entries/data/movies.json')));

const defaults = {
  interval: 10 // Time interval between entries. In seconds.
};

class Game {
  constructor(input) {
    Object.assign(this, defaults, input);
  }

  init() {
    setInterval(addEntry.bind(this), this.interval);
  }
}

function addEntry() {
  const newEntryIndex = Math.floor(Math.random() * movies.length);
  const entry = movies[newEntryIndex];

  this.addEntry(formatEntry(entry));
}

function formatEntry(entry) {
  return {
    tagLines: entry.tagLines.en,
    direction: entry.direction,
    cast: entry.cast,
    year: entry.year
  };
}

module.exports = Game;
