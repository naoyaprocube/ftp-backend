const mongooseSc = require('mongoose');
const { Schema } = mongooseSc;

const fileSchema = new Schema({
  filename: { type: String },
  contentType: { type: String },
  length: { type: Number },
  chunkSize: { type: Number },
  uploadDate: { type: Date },
});

module.exports = mongooseSc.model('fs.files', fileSchema);