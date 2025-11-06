# MindMate – AI-Driven Mental Health Assistant

MindMate is an intelligent, AI-powered platform that analyzes user-submitted text to understand mental health symptoms, emotional states, and behavioral patterns.

Using a fine-tuned NLP model and FastAPI backend, it provides personalized coping strategies, mindfulness suggestions, and connects users to verified therapists when needed through an integrated marketplace.

---

## Features

- **AI-Powered Mental Health Analysis** – Understand emotional tone, stress, and anxiety levels using NLP-based inference.
- **Personalized Recommendations** – Suggests remedies, self-care practices, and mindfulness techniques tailored to user input.
- **Therapist Marketplace** – Connects users with certified mental health professionals for advanced support.
- **FastAPI Backend** – High-performance, Python-based API server for AI processing and user data management.
- **Next.js Frontend** – Modern, responsive UI for seamless interaction and visualization.
- **MongoDB Integration** – Secure, scalable NoSQL database for storing user sessions, assessments, and chat history.
- **AWS Cloud Deployment** – APIs and assets hosted on AWS (EC2, S3) for reliability and scalability.
- **TypeScript & TailwindCSS** – Clean, maintainable frontend codebase with modern UI design.

---

## Tech Stack

| Layer          | Technologies                                  |
| -------------- | --------------------------------------------- |
| Frontend       | Next.js, TypeScript, TailwindCSS              |
| Backend        | FastAPI, Python                               |
| AI/NLP         | Fine-tuned language model (transformer-based) |
| Database       | MongoDB                                       |
| Cloud          | AWS (EC2, S3)                                 |
| Authentication | JWT-based auth                                |
| DevOps         | Docker, GitHub Actions                        |

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/manish-lal12/mindmate.git
cd mindmate
```

### 2. Install Dependencies

Frontend (Next.js)

```bash
cd frontend
npm install
```

Backend (FastAPI)

```bash
cd ../backend
pip install -r requirements.txt
```

### 3. Environment Setup

Create a .env file in both frontend/ and backend/ directories with your configuration variables.
Frontend (frontend/.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Backend (backend/.env)

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mindmate
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### 4. Run the Application

Start Backend (FastAPI)

```bash
cd backend
uvicorn main:app --reload
```

Start Frontend (Next.js)

```bash
cd ../frontend
npm run dev
```

Visit http://localhost:3000 to open the application.

### Project Structure

```
plaintextmindmate/
├── frontend/ # Next.js + TypeScript client application
│ ├── components/ # UI components and pages
│ └── utils/ # API helpers and state management
│
├── backend/ # FastAPI server
│ ├── models/ # Data schemas
│ ├── routes/ # API endpoints
│ ├── services/ # NLP and AI inference logic
│ └── database/ # MongoDB connection and queries
│
└── README.md
```

### Deployment

MindMate supports deployment on major platforms including AWS, Vercel, and Docker.
Docker Deployment

```bash
docker-compose up --build
```

### AWS Deployment

Deploy backend using AWS EC2 (Ubuntu + Nginx reverse proxy)
Store static assets and logs on S3
Configure environment variables through AWS Secrets Manager

### Future Roadmap

Integration with wearable data (sleep, heart rate) for holistic analysis
Emotion detection via speech/text fusion
Therapist dashboard for session insights
Real-time chat with AI counselor
