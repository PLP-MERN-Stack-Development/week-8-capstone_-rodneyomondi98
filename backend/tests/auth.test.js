const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const { mongoURI } = require('../config');

describe('Auth Integration', () => {
  beforeAll(async () => {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  afterEach(async () => {
    await User.deleteMany({});
  });

  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test2@example.com', password: 'password123', role: 'student' });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('prevents duplicate registration', async () => {
    await User.create({ name: 'Test', email: 'test2@example.com', password: 'hashed', role: 'student' });
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test2@example.com', password: 'password123', role: 'student' });
    expect(res.statusCode).toBe(400);
  });

  it('logs in with correct credentials', async () => {
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash('password123', 10);
    await User.create({ name: 'Test', email: 'test2@example.com', password: hashed, role: 'student' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test2@example.com', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('denies access to protected route without token', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).toBe(200); // public route
    // For a protected route, e.g. POST /api/courses
    const res2 = await request(app).post('/api/courses').send({ title: 'Test' });
    expect(res2.statusCode).toBe(401);
  });
}); 