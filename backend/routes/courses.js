const express = require('express');
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  const courses = await Course.find().populate('instructor', 'name email');
  res.json(courses);
});

// Get single course
router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'name email');
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

// Create course (instructor only)
router.post('/', auth, role('instructor'), [
  body('title').notEmpty(),
  body('description').optional()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, description } = req.body;
  const course = new Course({
    title,
    description,
    instructor: req.user.id
  });
  await course.save();
  // Add to instructor's createdCourses
  await User.findByIdAndUpdate(req.user.id, { $push: { createdCourses: course._id } });
  res.status(201).json(course);
});

// Update course (instructor only)
router.put('/:id', auth, role('instructor'), async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (course.instructor.toString() !== req.user.id) return res.status(403).json({ error: 'Not your course' });
  Object.assign(course, req.body);
  await course.save();
  res.json(course);
});

// Delete course (instructor only)
router.delete('/:id', auth, role('instructor'), async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (course.instructor.toString() !== req.user.id) return res.status(403).json({ error: 'Not your course' });
  await course.remove();
  res.json({ message: 'Course deleted' });
});

// Enroll in course (student only)
router.post('/:id/enroll', auth, role('student'), async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (course.enrolledStudents.includes(req.user.id)) return res.status(400).json({ error: 'Already enrolled' });
  course.enrolledStudents.push(req.user.id);
  await course.save();
  await User.findByIdAndUpdate(req.user.id, { $push: { enrolledCourses: course._id } });
  res.json({ message: 'Enrolled successfully' });
});

module.exports = router; 