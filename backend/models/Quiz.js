const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String
  }],
  studentAttempts: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answers: [String],
    score: Number,
    attemptedAt: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema); 