# Med Connect

A platform connecting medical professionals worldwide for better healthcare outcomes.

## Project Structure

```
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── styles/
│   └── homepage.tsx
│
├── backend/
│   ├── src/
│   │   ├── app/
│   │   │   └── api/
│   │   │       ├── auth/
│   │   │       └── posts/
│   │   ├── models/
│   │   └── services/
│   └── .env
```

## Features

- User authentication and authorization
- Medical professional profiles
- Institution profiles
- Posts, likes, comments, and sharing functionality
- Secure API endpoints with JWT authentication
- MongoDB database integration
- Firebase services integration

## Tech Stack

- **Frontend:**
  - Next.js
  - TypeScript
  - Tailwind CSS
  - React

- **Backend:**
  - Next.js API routes
  - MongoDB with Mongoose
  - Firebase Admin SDK
  - JWT authentication
  - bcrypt for password hashing

## Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd med-connect
```

2. **Install dependencies**

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Set up environment variables**

Create `.env` files in both frontend and backend directories:

Frontend `.env`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Backend `.env`:
```
MONGODB_URI=your_mongodb_connection_string
FIREBASE_ADMIN_SDK_JSON=your_firebase_admin_sdk_json
JWT_SECRET=your_jwt_secret
```

4. **Run the development servers**

```bash
# Start frontend (default port: 3000)
cd frontend
npm run dev

# Start backend (default port: 3001)
cd backend
npm run dev
```


## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.