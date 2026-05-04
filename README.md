# 🚀 UrbanCare Frontend

A modern, responsive frontend for **UrbanCare – Civic Complaint Management System**, built using React.  
This application enables users to **register, submit complaints with media, and track their status in real-time**.

## 🌍 Live Demo

👉 https://urbancaredev.vercel.app  

## 📌 Overview

UrbanCare is designed to provide a **clean, intuitive, and real-world user experience** for handling civic complaints.

This frontend interacts with a RESTful backend API to:
- Authenticate users securely  
- Submit complaints with images/videos  
- Track complaint status using a unique ID  
- Provide role-based dashboards  

## ✨ Features

### 👤 User Features
- 🔐 Login & Registration with OTP verification  
- 📝 Submit complaints with detailed information  
- 📸 Upload images (max 5) and 🎥 videos (max 2)  
- 🔍 Track complaint status using unique ID  
- 📊 View complaint history  

### 🛠 Admin Features
- 📋 View and manage all complaints  
- 🔄 Update complaint status (Pending → In Progress → Closed)  
- 👥 Manage users and officers  
- 📈 Analytics dashboard  

### 🎨 UI/UX Highlights
- Clean and responsive design  
- Government-style civic interface  
- Toast notifications for user feedback  
- Form validation with real-time error handling  

## 🧠 Tech Stack

- React 18  
- React Router DOM  
- Axios  
- React Hot Toast  
- Styled Components / CSS  

## 🔐 Authentication Flow

- JWT token stored in `sessionStorage`  
- Protected routes using middleware logic  
- OTP-based verification for registration and password reset  

## ☁️ Media Upload Flow

1. User selects images/videos  
2. Files are uploaded to Cloudinary via signed API  
3. Secure URLs are returned  
4. URLs are sent to backend with complaint data  

## 🔌 API Integration
The frontend communicates with backend using Axios:
POST /api/complaint/submit
GET /api/complaint/track/:id
POST /api/auth/login
POST /api/auth/register1

## 🛠 Installation & Setup

`bash
# Clone repository
git clone https://github.com/ritikkrawat/UrbanCare-Frontend

# Install dependencies
npm install

# Start development server
npm start
