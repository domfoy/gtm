const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Types = Schema.Types;

const schema = new Schema({
  ref: Types.String,
  updateCount: Types.Number,
  insertDate: Types.Date,
  updateDate: Types.Date,
  movie: Types.ObjectId,
  firstFullFetchDate: Types.Date,
  lastFullFetchDate: Types.Date
});

module.exports = mongoose.model('Entry', schema);
