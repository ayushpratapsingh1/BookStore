const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  coverImage: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /\.(jpg|jpeg|png|gif)$/i.test(v);
      },
      message: props => `${props.value} is not a valid image format!`
    }
  },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  uploader: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);