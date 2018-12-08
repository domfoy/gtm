const _ = require('lodash');

const db = require('../../src/database'),
      {Entry} = require('../../src/model');

function storeEntries(movieRefs) {
  return db.open()
    .then(() => {
      const results = _.reduce(
        movieRefs,
        (acc, movieRef) => acc.then(accResults => handleStoreEntry(accResults, movieRef)),
        Promise.resolve([])
      );

      return results.then((verdict) => {
        console.log(verdict);
      });
    });
}

function handleStoreEntry(results, movieRef) {
  return storeEntry(movieRef)
    .then(result => results.push({payload: result}) && results)
    .catch(err => results.push({error: true, payload: err}) && results);
}

function storeEntry(movieRef) {
  console.log(movieRef);
  return Entry.findOne({ref: movieRef})
    .then((entry) => {
      const date = new Date();
      if (!entry) {
        console.log('att');
        return new Entry({
          ref: movieRef,
          insertDate: date,
          updateDate: date,
          updateCount: 1

        }).save();
      }

      Object.assign(entry, {
        updateDate: date,
        updateCount: entry.updateCount + 1
      });

      console.log(entry);
      return entry.save();
    });
}

module.exports = storeEntries;
