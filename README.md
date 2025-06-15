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
- **Framework**: Next.js
- **UI Components**: Custom components built with Shadcn UI
- **Styling**: TailwindCSS
- **State Management**: React Hooks
- **Authentication**: Firebase Authentication

### Backend
- **Framework**: Next.js API Routes
- **Database**: MongoDB (via services/db.ts)
- **Authentication**: JWT + Firebase Auth
- **File Storage**: Firebase Storage

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
- Firebase project credentials

### Installation

1. Clone the repository:
\`\`\`bash
git clone [repository-url]
\`\`\`

2. Install frontend dependencies:
\`\`\`bash
cd frontend
pnpm install
\`\`\`

3. Install backend dependencies:
\`\`\`bash
cd backend
pnpm install
\`\`\`

4. Set up environment variables:

Create `.env.local` in both frontend and backend directories with the following variables:

Frontend:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
\`\`\`

Backend:
\`\`\`env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FIREBASE_ADMIN_CREDENTIALS=your_firebase_admin_credentials
\`\`\`

5. Start the development servers:

Frontend:
\`\`\`bash
cd frontend
pnpm dev
\`\`\`

Backend:
\`\`\`bash
cd backend
pnpm dev
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🔒 Authentication

MedConnect uses a dual authentication system:
1. Firebase Authentication for user management
2. JWT tokens for API authentication

Users can sign up/login using:
- Email/Password
- Google Sign-in
- (Other providers can be added as needed)

## 🔑 API Endpoints

### Authentication
- POST `/api/auth/signup` - Create new user account
- POST `/api/auth/login` - User login

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile

### Posts
- GET `/api/posts` - Get feed posts
- POST `/api/posts` - Create new post
- POST `/api/posts/like` - Like/unlike post
- POST `/api/posts/comment` - Comment on post

### Jobs
- GET `/api/jobs` - Get job listings
- POST `/api/jobs` - Create job posting
- GET `/api/jobs/:id` - Get job details

### Institutions
- GET `/api/institutions` - Get institution listings
- GET `/api/institutions/profile` - Get institution profile
- PUT `/api/institutions/profile` - Update institution profile

## 📱 Responsive Design

MedConnect is built with a mobile-first approach, ensuring a great user experience across:
- Mobile devices
- Tablets
- Desktop computers

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For any queries regarding the project, please reach out to [contact email]
