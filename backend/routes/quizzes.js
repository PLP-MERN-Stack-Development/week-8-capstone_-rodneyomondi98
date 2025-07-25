const express = require('express');
const { body, validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

// Get all quizzes for a course
router.get('/course/:courseId', auth, async (req, res) => {
  const quizzes = await Quiz.find({ course: req.params.courseId });
  res.json(quizzes);
});

// Create quiz (instructor only)
router.post('/', auth, role('instructor'), [
  body('course').notEmpty(),
  body('questions').isArray({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { course, questions } = req.body;
  // Check instructor owns the course
  const courseDoc = await Course.findById(course);
  if (!courseDoc) return res.status(404).json({ error: 'Course not found' });
  if (courseDoc.instructor.toString() !== req.user.id) return res.status(403).json({ error: 'Not your course' });
  const quiz = new Quiz({ course, questions });
  await quiz.save();
  courseDoc.quizzes.push(quiz._id);
  await courseDoc.save();
  res.status(201).json(quiz);
});

// Update quiz (instructor only)
router.put('/:id', auth, role('instructor'), async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  // Check instructor owns the course
  const courseDoc = await Course.findById(quiz.course);
  if (courseDoc.instructor.toString() !== req.user.id) return res.status(403).json({ error: 'Not your course' });
  Object.assign(quiz, req.body);
  await quiz.save();
  res.json(quiz);
});

// Delete quiz (instructor only)
router.delete('/:id', auth, role('instructor'), async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  const courseDoc = await Course.findById(quiz.course);
  if (courseDoc.instructor.toString() !== req.user.id) return res.status(403).json({ error: 'Not your course' });
  await quiz.remove();
  courseDoc.quizzes.pull(quiz._id);
  await courseDoc.save();
  res.json({ message: 'Quiz deleted' });
});

// Student attempts quiz
router.post('/:id/attempt', auth, role('student'), [
  body('answers').isArray()
], async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  const { answers } = req.body;
  // Simple scoring
  let score = 0;
  quiz.questions.forEach((q, i) => {
    if (answers[i] && answers[i] === q.correctAnswer) score++;
  });
  quiz.studentAttempts.push({ student: req.user.id, answers, score, attemptedAt: new Date() });
  await quiz.save();
  res.json({ score });
});

module.exports = router; 