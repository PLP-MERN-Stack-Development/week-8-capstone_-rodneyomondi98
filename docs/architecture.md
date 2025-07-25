# Technical Architecture Overview

## System Diagram

Frontend (React + Vite + Tailwind)
    |
    |  REST API (Axios)
    v
Backend (Node.js + Express + Mongoose)
    |
    |  MongoDB Atlas
    v
Database (MongoDB)

[Socket.IO for real-time chat between frontend and backend]

## Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Socket.IO Client
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Socket.IO
- **Testing:** Jest, Supertest, React Testing Library, Cypress
- **CI/CD:** GitHub Actions

## Data Flow
- Client sends requests to REST API (auth, courses, lessons, quizzes)
- Backend validates, processes, and interacts with MongoDB
- Real-time chat via Socket.IO

## Real-Time Features
- Socket.IO enables live chat in each course room

## Testing
- Unit and integration tests (Jest, Supertest)
- Frontend component tests (React Testing Library)
- E2E tests (Cypress)

## CI/CD
- GitHub Actions: run tests and deploy on push to main 