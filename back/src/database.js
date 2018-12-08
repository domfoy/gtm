const mongoose = require('mongoose'),
      config = require('config');

mongoose.Promise = Promise;

module.exports = {
  open() {
    return mongoose.connect(config.dbUri);
  },
  close() {
    return mongoose.disconnect();
  }
};
