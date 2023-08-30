const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  destiny: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;