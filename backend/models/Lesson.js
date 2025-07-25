const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  videoUrl: { type: String },
  content: { type: String },
  order: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema); 