# API Documentation

## Auth

### Register
- **POST** `/api/auth/register`
- Request: `{ name, email, password, role }`
- Response: `{ token }`

### Login
- **POST** `/api/auth/login`
- Request: `{ email, password }`
- Response: `{ token }`

---

## Courses

### Get All Courses
- **GET** `/api/courses`
- Response: `[ { _id, title, description, instructor, ... } ]`

### Create Course (Instructor)
- **POST** `/api/courses`
- Auth: Bearer token (instructor)
- Request: `{ title, description }`
- Response: `Course object`

### Enroll in Course (Student)
- **POST** `/api/courses/:id/enroll`
- Auth: Bearer token (student)
- Response: `{ message }`

---

## Lessons

### Get Lessons for Course
- **GET** `/api/lessons/course/:courseId`
- Response: `[ { _id, title, videoUrl, content, ... } ]`

### Create Lesson (Instructor)
- **POST** `/api/lessons`
- Auth: Bearer token (instructor)
- Request: `{ course, title, videoUrl, content, order }`
- Response: `Lesson object`

---

## Quizzes

### Get Quizzes for Course
- **GET** `/api/quizzes/course/:courseId`
- Response: `[ { _id, questions, ... } ]`

### Attempt Quiz (Student)
- **POST** `/api/quizzes/:id/attempt`
- Auth: Bearer token (student)
- Request: `{ answers }`
- Response: `{ score }`

---

## Chat (Socket.IO)
- Connect to `/` via Socket.IO
- Join room: `joinRoom` event with `{ courseId }`
- Send message: `chatMessage` event with `{ content }`
- Receive message: `message` event 