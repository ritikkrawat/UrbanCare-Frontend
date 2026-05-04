🚀 UrbanCare Frontend

A modern, responsive frontend for UrbanCare – Civic Complaint Management System, built using React.
This application enables users to register, submit complaints with media, and track their status in real-time.

🌍 Live Demo

👉 https://urbancaredev.vercel.app

📌 Overview

UrbanCare is designed to provide a clean, intuitive, and real-world user experience for handling civic complaints.

This frontend interacts with a RESTful backend API to:

Authenticate users securely
Submit complaints with images/videos
Track complaint status using a unique ID
Provide role-based dashboards
✨ Features
👤 User Features
🔐 Login & Registration with OTP verification
📝 Submit complaints with detailed information
📸 Upload images (max 5) and 🎥 videos (max 2)
🔍 Track complaint status using unique ID
📊 View complaint history
🛠 Admin Features
📋 View and manage all complaints
🔄 Update complaint status (Pending → In Progress → Closed)
👥 Manage users and officers
📈 Analytics dashboard
🎨 UI/UX Highlights
Clean and responsive design
Government-style civic interface
Toast notifications for user feedback
Form validation with real-time error handling
🧠 Tech Stack
React 18
React Router DOM
Axios
React Hot Toast
Styled Components / CSS
⚙️ Project Structure
src/
│
├── admin/                # Admin panel
│   ├── components/
│   ├── pages/
│   └── layouts/
│
├── user/                 # User panel
│   ├── components/
│   ├── pages/
│   └── layouts/
│
├── shared/               # Shared components/utilities
├── context/              # Global state (Auth, etc.)
├── routes/               # Route management
├── assets/               # Static files
└── App.jsx               # Main app entry
🔐 Authentication Flow
JWT token stored in sessionStorage
Protected routes using middleware logic
OTP-based verification for registration and password reset
☁️ Media Upload Flow
User selects images/videos
Files are uploaded to Cloudinary via signed API
Secure URLs are returned
URLs are sent to backend with complaint data
🔌 API Integration

The frontend communicates with backend using Axios:

POST /api/complaint/submit
GET  /api/complaint/track/:id
POST /api/auth/login
POST /api/auth/register
🛠 Installation & Setup
# Clone repository
git clone https://github.com/YOUR-USERNAME/YOUR-REPO

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
🔧 Environment Variables

Create a .env file in the root:

REACT_APP_API_URL=your_backend_url
🚀 Deployment
Hosted on Vercel
Optimized for production builds
Environment variables configured via Vercel dashboard
📸 Screenshots

Add screenshots here (Home Page, Dashboard, Complaint Form)

🤝 Contribution

Contributions, suggestions, and improvements are welcome!

Feel free to:

Open issues
Submit pull requests
Share feedback
💬 Feedback

If you try this project, please:

Submit a real complaint scenario
Explore all features
Share your feedback

📩 DM me for improvements or collaboration ideas

📄 License

This project is licensed under the ISC License.

👨‍💻 Author

Ritik
Frontend & Full Stack Developer
