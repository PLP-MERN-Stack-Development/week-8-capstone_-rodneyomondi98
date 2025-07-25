const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Course = require('../models/Course');
const { mongoURI } = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

let instructorToken, studentToken, courseId;

beforeAll(async () => {
  await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  // Create instructor
  const instructor = await User.create({
    name: 'Instructor',
    email: 'instructor@example.com',
    password: await bcrypt.hash('password', 10),
    role: 'instructor'
  });
  instructorToken = jwt.sign({ id: instructor._id, role: 'instructor' }, jwtSecret);
  // Create student
  const student = await User.create({
    name: 'Student',
    email: 'student@example.com',
    password: await bcrypt.hash('password', 10),
    role: 'student'
  });
  studentToken = jwt.sign({ id: student._id, role: 'student' }, jwtSecret);
});
afterAll(async () => {
  await mongoose.connection.close();
});
afterEach(async () => {
  await Course.deleteMany({});
});

describe('Course Endpoints', () => {
  it('should get all courses (empty)', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should allow instructor to create a course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({ title: 'Test Course', description: 'Desc' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Course');
    courseId = res.body._id;
  });

  it('should allow student to enroll in a course', async () => {
    // Create course as instructor
    const course = await Course.create({ title: 'Test', instructor: mongoose.Types.ObjectId() });
    const res = await request(app)
      .post(`/api/courses/${course._id}/enroll`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Enrolled/);
  });
}); 