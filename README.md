# SignKenya Online Learning Portal

A full-stack MERN application for learning and teaching sign language online.

## Features
- User registration and login (student/instructor)
- Course creation, enrollment, and management
- Video lessons and quizzes
- Real-time course chat
- Role-based access control
- Responsive UI (React + Tailwind)
- Comprehensive testing (Jest, Supertest, Cypress)

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Socket.IO Client
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Socket.IO
- **Testing:** Jest, Supertest, React Testing Library, Cypress
- **Deployment:** Render (backend), Vercel (frontend)

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB

### Backend
```bash
cd backend
npm install
# Set up .env (see .env.example)
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Running Tests
- **Backend:** `npm test` (in backend)
- **Frontend:** `npm test` (in frontend)
- **E2E:** `npx cypress open` (in frontend)

### Deployment
- Deploy backend to Render/Heroku/Railway
- Deploy frontend to Vercel/Netlify
- Set environment variables as needed

## Documentation
- [API Documentation](docs/api.md)
- [User Guide](docs/user-guide.md)
- [Technical Architecture](docs/architecture.md)

## License
MIT 