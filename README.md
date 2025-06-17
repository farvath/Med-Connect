# MedConnect

MedConnect is a professional networking platform designed specifically for healthcare professionals, institutions, and medical students. It facilitates connections, job opportunities, and knowledge sharing within the medical community.

## 🌟 Features

### For Healthcare Professionals
- Professional networking with other healthcare workers
- Job search and application
- Post and share medical knowledge and experiences
- Connect with medical institutions

### For Medical Institutions
- Institution profile management
- Job posting capabilities
- Connect with potential candidates
- Share updates and announcements

### For Medical Students
- Connect with professionals and institutions
- Explore job and internship opportunities
- Access shared medical knowledge
- Build professional networks early in career

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 13+
- **UI Components**: Shadcn UI
- **Styling**: TailwindCSS
- **State Management**: Zustand (with persistence)
- **Authentication State**: Zustand global store
- **API Client**: Axios

### Backend
- **Framework**: Next.js API Routes (App Router)
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: [ImageKit](https://imagekit.io/) (for user avatars, institution logos, etc.)
  - Integration via custom backend service (`backend/src/services/imagekitService.ts`)

### Other
- **TypeScript** everywhere
- **CORS** and custom middleware for API security

## 📂 Project Structure

```
frontend/
├── app/                  # Next.js 13+ app directory
│   ├── colleges/        # College listings and profiles
│   ├── connections/     # Network connections
│   ├── feed/           # Social feed
│   ├── hospitals/      # Hospital listings
│   ├── jobs/          # Job listings
│   └── auth/          # Authentication pages
├── components/         # Reusable UI components
└── lib/               # Utility functions and API clients

backend/
├── src/
│   ├── app/           # API routes
│   ├── models/        # Database models
│   ├── services/      # Business logic
│   └── types/         # TypeScript types
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or pnpm package manager
- MongoDB database
- ImageKit for file storage

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Set up environment variables:

Create ```.env``` in both frontend and backend directories with the following variables:

Frontend - env:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
```

Backend - env :
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FIREBASE_ADMIN_CREDENTIALS=your_firebase_admin_credentials
```

5. Start the development servers:

Frontend:
```
cd frontend
npm dev
```

Backend:
```
cd backend
npm dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001



