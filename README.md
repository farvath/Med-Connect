# MedConnect

MedConnect is a comprehensive professional networking platform designed specifically for healthcare professionals, medical institutions, and students. It facilitates professional connections, job opportunities, knowledge sharing, and career development within the medical community.

## 🌟 Key Features

### 🩺 For Healthcare Professionals
- **Professional Networking**: Connect with other healthcare workers, build professional relationships
- **Advanced Job Search**: Browse medical job opportunities with powerful filtering (location, specialization, experience level)
- **Job Application Tracking**: Track application status (pending, accepted, rejected)
- **Professional Profile Management**: Showcase skills, experience, education, and achievements
- **Social Feed**: Share medical knowledge, experiences, and professional updates
- **Institution Discovery**: Explore and connect with medical institutions and hospitals

### 🏥 For Medical Institutions & Hospitals
- **Institutional Profiles**: Comprehensive institution management with detailed information
- **Advanced Job Posting**: Post medical positions with detailed requirements, responsibilities, and benefits
- **Application Management**: View and manage job applications with integrated applicant profiles
- **Candidate Discovery**: Browse and connect with potential healthcare professionals
- **Dashboard Analytics**: Track posted jobs and application statistics

### 🎓 For Medical Students
- **Career Exploration**: Discover internship and entry-level opportunities
- **Professional Networking**: Connect with experienced professionals and mentors
- **Educational Resources**: Access shared medical knowledge and experiences
- **Early Career Building**: Build professional networks before graduation

## 🛠 Tech Stack

### Frontend Architecture
- **Framework**: Next.js 13+ with App Router
- **UI Components**: Shadcn UI with Radix UI primitives
- **Styling**: TailwindCSS with responsive design patterns
- **State Management**: React Context API for authentication and global state
- **Form Handling**: React Hook Form with validation
- **API Client**: Axios with custom interceptors
- **Toast Notifications**: Sonner for user feedback
- **Icons**: Lucide React icon library

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with secure middleware
- **File Storage**: ImageKit integration for profile pictures and media
- **API Design**: RESTful APIs with proper HTTP status codes
- **Data Validation**: Mongoose schema validation
- **Security**: CORS, authentication middleware, input sanitization

### Database Schema
- **Users**: Healthcare professionals, students, and institutional accounts
- **Jobs**: Medical job postings with detailed requirements
- **Job Applications**: Application tracking with status management
- **Connections**: Professional networking relationships
- **Posts**: Social feed content with engagement tracking
- **Institutions**: Hospital and medical college profiles

## 📂 Detailed Project Structure

```
MedConnect/
├── frontend/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── colleges/          # Medical college listings and profiles
│   │   ├── connections/       # Professional networking interface
│   │   ├── feed/             # Social media feed
│   │   ├── hospitals/        # Hospital listings and profiles
│   │   ├── jobs/             # Job marketplace
│   │   │   ├── create/       # Job posting form (institutions only)
│   │   │   └── page.tsx      # Job listings with tabs (Browse/Posted/Applied)
│   │   ├── login/           # Authentication pages
│   │   ├── signup/          
│   │   ├── profile/         # User profile management
│   │   │   ├── [id]/        # Dynamic profile viewing
│   │   │   └── UserContentManager.tsx
│   │   └── layout.tsx       # Global layout with navigation
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn UI components
│   │   ├── Header.tsx      # Navigation header
│   │   └── theme-provider.tsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication state management
│   ├── lib/                # Utility functions
│   │   ├── api.ts          # API client configuration
│   │   └── utils.ts        # Helper functions
│   └── types/              # TypeScript type definitions
│       ├── user.ts
│       ├── jobs.ts
│       └── apiResponse.ts
├── backend/
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   │   ├── authController.ts
│   │   │   ├── jobController.ts
│   │   │   ├── userController.ts
│   │   │   ├── postController.ts
│   │   │   └── connectionController.ts
│   │   ├── middleware/      # Custom middleware
│   │   │   └── authMiddleware.ts
│   │   ├── models/         # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Job.ts
│   │   │   ├── JobApplication.ts
│   │   │   ├── Post.ts
│   │   │   └── Connection.ts
│   │   ├── routes/         # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── jobRoutes.ts
│   │   │   └── userRoutes.ts
│   │   ├── services/       # Business logic
│   │   │   ├── db.ts
│   │   │   ├── jwt.ts
│   │   │   └── imagekitService.ts
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **npm** or **pnpm** package manager
- **MongoDB** database (local or cloud)
- **ImageKit** account for file storage

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/farvath/Med-Connect.git
cd Med-Connect
```

2. **Install frontend dependencies:**
```bash
cd frontend
npm install
```

3. **Install backend dependencies:**
```bash
cd ../backend
npm install
```

4. **Set up environment variables:**

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

**Backend `.env`:**
```env
MONGODB_URI=mongodb://localhost:27017/medconnect
JWT_SECRET=your_super_secret_jwt_key_here
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
PORT=3001
```

5. **Start the development servers:**

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

6. **Access the application:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🗄️ Database Setup

### MongoDB Collections

The application uses the following MongoDB collections:

1. **users** - Healthcare professionals, students, and institutions
2. **jobs** - Medical job postings
3. **jobapplications** - Job application tracking
4. **posts** - Social feed content
5. **connections** - Professional networking relationships
6. **hospitals** - Hospital profiles
7. **colleges** - Medical college profiles

### Sample Data Seeding

To populate the database with sample data:

```bash
cd backend
npm run seed:jobs    # Seeds sample medical jobs
npm run seed:users   # Seeds sample users (if available)
```

## 🔐 Authentication & Authorization

### Authentication Flow
1. **User Registration**: Email/password with account type selection
2. **Email Verification**: Secure account activation
3. **JWT Token**: Stateless authentication with HTTP-only cookies
4. **Role-Based Access**: Different permissions for professionals vs institutions

### Account Types
- **Professional**: Healthcare workers and medical students
- **Hospital**: Hospital and healthcare institutions
- **Institution**: Medical colleges and educational institutions

### Protected Routes
- Job posting (institutions only)
- Profile management
- Job applications
- Professional networking

## 🎯 Key Functionalities

### Job Marketplace
- **Three-Tab Interface**:
  - **Browse Jobs**: All available positions with filters
  - **My Posted Jobs**: Institution dashboard (institutions only)
  - **Applied Jobs**: User's application history
- **Advanced Filtering**: Location, job type, experience level
- **Infinite Scroll**: Seamless job browsing experience
- **Application Tracking**: Real-time status updates

### Professional Networking
- **Connection Management**: Send, accept, reject connection requests
- **Profile Discovery**: Browse healthcare professionals
- **Clickable Profiles**: Direct navigation to user profiles
- **Network Analytics**: Connection statistics

### User Profiles
- **Dynamic Routing**: `/profile/[id]` for any user
- **Comprehensive Sections**: 
  - Personal information
  - Professional experience
  - Education background
  - Skills and certifications
- **Always Visible**: Sections show even when empty with placeholders

### Responsive Design
- **Mobile-First**: Optimized for all device sizes
- **Touch-Friendly**: Easy navigation on mobile devices
- **Progressive Enhancement**: Works across all browsers

## 🎨 UI/UX Features

### Design System
- **Consistent Branding**: Medical blue color scheme
- **Accessibility**: WCAG compliant components
- **Dark Mode Ready**: Theme system in place
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages

### Interactive Elements
- **Toast Notifications**: Real-time feedback
- **Modal Dialogs**: Job details and applications
- **Hover States**: Visual feedback on interactions
- **Button States**: Loading, disabled, success states

## 🔄 API Architecture

### RESTful Endpoints

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

**Jobs:**
- `GET /api/jobs` - Get jobs with pagination and filters
- `POST /api/jobs` - Create new job (institutions only)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs/:id/apply` - Apply for job
- `GET /api/jobs/:id/applications` - Get job applications (job poster only)
- `GET /api/jobs/user/posted` - Get user's posted jobs
- `GET /api/jobs/user/applications` - Get user's job applications

**Users:**
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID

**Connections:**
- `GET /api/connections` - Get user connections
- `POST /api/connections/request` - Send connection request
- `PUT /api/connections/:id/accept` - Accept connection request

### Error Handling
- **Consistent Error Format**: Standardized error responses
- **HTTP Status Codes**: Proper status code usage
- **Validation Errors**: Detailed field-level validation
- **Authentication Errors**: Clear auth failure messages

## 🚦 Development Workflow

### Code Quality
- **TypeScript**: Full type safety across the stack
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Git Hooks**: Pre-commit quality checks

### Testing Strategy
- **Unit Tests**: Component and function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: User journey testing
- **Manual Testing**: Cross-browser compatibility

### Deployment
- **Frontend**: Vercel/Netlify deployment ready
- **Backend**: Node.js server deployment
- **Database**: MongoDB Atlas for production
- **Environment**: Production environment configuration

## 🛡️ Security Features

### Data Protection
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Mongoose query protection
- **XSS Protection**: Input sanitization
- **CORS Configuration**: Controlled cross-origin requests

### Authentication Security
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Secure token generation and validation
- **Session Management**: Token expiration and refresh
- **Rate Limiting**: API request throttling

## 📊 Performance Optimizations

### Frontend Optimizations
- **Next.js App Router**: Server-side rendering and static generation
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: On-demand component loading
- **Infinite Scroll**: Efficient pagination for large datasets

### Backend Optimizations
- **Database Indexing**: Optimized MongoDB queries
- **Pagination**: Efficient data loading
- **Caching Strategy**: Response caching for frequently accessed data
- **Connection Pooling**: MongoDB connection optimization

## 🐛 Troubleshooting

### Common Issues

**1. Backend not connecting to MongoDB:**
```bash
# Check MongoDB connection string
# Ensure MongoDB is running locally or accessible remotely
# Verify network connectivity
```

**2. Frontend API calls failing:**
```bash
# Verify backend server is running on port 3001
# Check NEXT_PUBLIC_API_URL in frontend .env.local
# Ensure CORS is properly configured
```

**3. ImageKit upload issues:**
```bash
# Verify ImageKit credentials in .env
# Check ImageKit public/private key configuration
# Ensure ImageKit URL endpoint is correct
```

**4. Authentication not working:**
```bash
# Verify JWT_SECRET is set in backend .env
# Check token expiration settings
# Clear browser localStorage/cookies
```

## 🤝 Contributing

We welcome contributions to MedConnect! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Farvath** - *Lead Developer* - [GitHub Profile](https://github.com/farvath)

## 🙏 Acknowledgments

- **Shadcn/ui** for the beautiful UI components
- **Next.js** team for the amazing framework
- **MongoDB** for the robust database solution
- **ImageKit** for reliable media storage
- **Healthcare Community** for inspiration and requirements gathering

## 📞 Support

For support, email support@medconnect.com or join our Slack channel.

## 🔮 Future Enhancements

### Planned Features
- **Real-time Messaging**: Direct communication between healthcare professionals
- **Video Consultations**: Integrated telemedicine capabilities
- **Medical Forums**: Specialized discussion boards by medical specialty
- **Certification Tracking**: Professional certification and continuing education management
- **Mobile App**: React Native mobile application
- **Analytics Dashboard**: Advanced analytics for institutions
- **AI-Powered Matching**: Intelligent job and connection recommendations
- **Multi-language Support**: International accessibility

### Technical Improvements
- **GraphQL API**: More efficient data fetching
- **Microservices Architecture**: Scalable backend services
- **Redis Caching**: Advanced caching layer
- **Elasticsearch**: Enhanced search capabilities
- **WebRTC Integration**: Real-time communication features
- **Progressive Web App**: Enhanced mobile experience

## 📈 Version History

- **v1.0.0** - Initial release with core functionality
  - User authentication and profiles
  - Job marketplace
  - Professional networking
  - Responsive design

---

**MedConnect** - Connecting Healthcare Professionals Worldwide 🌍

For more information, visit our [documentation](docs/) or [live demo](https://medconnect-demo.vercel.app).



