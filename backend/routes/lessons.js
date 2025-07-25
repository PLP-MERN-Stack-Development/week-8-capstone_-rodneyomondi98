const express = require('express');
const { body, validationResult } = require('express-validator');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

// Get all lessons for a course
router.get('/course/:courseId', auth, async (req, res) => {
  const lessons = await Lesson.find({ course: req.params.courseId }).sort('order');
  res.json(lessons);
});

// Create lesson (instructor only)
router.post('/', auth, role('instructor'), [
  body('course').notEmpty(),
  body('title').notEmpty(),
  body('videoUrl').optional(),
  body('content').optional(),
  body('order').optional().isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { course, title, videoUrl, content, order } = req.body;
  // Check instructor owns the course
  const courseDoc = await Course.findById(course);
  if (!courseDoc) return res.status(404).json({ error: 'Course not found' });
  if (courseDoc.instructor.toString() !== req.user.id) return res.status(403).json({ error: 'Not your course' });
  const lesson = new Lesson({ course, title, videoUrl, content, order });
  await lesson.save();
  courseDoc.lessons.push(lesson._id);
  await courseDoc.save();
  res.status(201).json(lesson);
});

// Update lesson (instructor only)
router.put('/:id', auth, role('instructor'), async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  // Check instructor owns the course
  const courseDoc = await Course.findById(lesson.course);
  if (courseDoc.instructor.toString() !== req.user.id) return res.status(403).json({ error: 'Not your course' });
  Object.assign(lesson, req.body);
  await lesson.save();
  res.json(lesson);
});

// Delete lesson (instructor only)
router.delete('/:id', auth, role('instructor'), async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  const courseDoc = await Course.findById(lesson.course);
  if (courseDoc.instructor.toString() !== req.user.id) return res.status(403).json({ error: 'Not your course' });
  await lesson.remove();
  courseDoc.lessons.pull(lesson._id);
  await courseDoc.save();
  res.json({ message: 'Lesson deleted' });
});

module.exports = router; 