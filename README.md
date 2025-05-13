# Gymsarthi - Gym Management System
## Topic
Gym Management and Fitness Technology

## Description
- Gymsarthi simplifies gym operations with a centralized platform for administrators, trainers, and members.  
- Admins can manage trainers, members, plans, and analytics.  
- Trainers can assign tasks and view schedules.  
- Members can book classes, track payments, and access personalized workout/diet plans.  
- Built with modern web technologies, including real-time chat, QR code-based attendance, and data visualization.  
- A robust solution for gym owners.  
- Deployed and accessible online.  
- Showcases Felix’s skills in full-stack development using the MERN stack.

## Features

### Admin Dashboard
- **Admin Profile**: Update personal information and upload profile image.
- **Trainer Management**: Create, edit, delete trainers, and display a list of trainers.
- **User Management**: View lists of plan-purchased and non-plan members, with the ability to delete members.
- **Plan Management**: Create, edit, delete membership plans, and showcase available plans.
- **Payment History**: Display all transactions, filter by criteria, and export to PDF for download.
- **Analytics**: Visualize user signup growth, plan purchases, and monthly revenue with interactive graphs.
- **Class Management**: Create classes (e.g., Zumba, Yoga) and view schedules in a calendar (today, day, week, month).
- **QR Code**: Generate downloadable QR code for member attendance, automatically refreshes every 24 hours.

### Trainer Dashboard
- **Trainer Profile**: Edit profile details and upload profile photo.
- **My Plans**: View assigned plans and their member lists, assign tasks to specific members.
  - Each plan is linked to a trainer; members purchasing a plan are auto-assigned to the trainer’s member list.
- **Class Schedule**: Display all classes linked to the trainer for easy scheduling.

### Member Dashboard
- **Member Profile**: Update profile information and upload profile image.
- **Trainer Profile**: View details of the assigned trainer.
- **Plan Purchased**: Display details of purchased membership plans.
- **Daily Tasks**: View tasks assigned by the trainer.
- **Payment History**: View all transactions, filter, and export to PDF.
- **Class Booking**: Browse and book available classes.
- **Pending Payments**: Pay pending dues, view remaining balance, and past payment history.
- **Attendance Calendar**: Track attendance history in a calendar and scan QR codes for check-in.
- **Plan Purchase**: Purchase plans, receive email confirmation with invoice from admin.
- **AI Workout & Diet Plan**: Generate personalized workout and diet plans by filling out a form.
- **Chat**: Real-time chat for members, trainers, and admins, with image-sharing support.

 ## Future Improvements
- Develop a mobile app using React Native for iOS and Android.
- Add video streaming for virtual classes using WebRTC or a third-party service.
- Integrate fitness wearables (e.g., Fitbit, Apple Watch) to sync workout data.
- Enhance AI workout/diet plans with machine learning (e.g., TensorFlow.js).
- Support multiple languages (e.g., Hindi, Tamil) for broader accessibility.
- Implement push notifications for class reminders and payment dues.

## Directory Structure 
```
Gymsarthi/
├── frontend/                # React frontend code
│   ├── src/                 # Source files
│   │   ├── assets/          # Images, CSS, and other static files
│   │   ├── components/      # Reusable React components (e.g., Navbar, QRScanner)
│   │   ├── pages/           # Page components (e.g., AdminDashboard, MemberProfile)
│   │   ├── redux/           # Redux store and slices (using @reduxjs/toolkit)
│   │   ├── routes/          # Route definitions (using react-router-dom)
│   │   ├── styles/          # Tailwind CSS and custom styles
│   │   ├── utils/           # Utility functions (e.g., API calls with axios)
│   │   └── App.jsx          # Main App component
│   ├── public/              # Public assets (e.g., index.html)
│   ├── screenshots/         # Screenshots for README
│   ├── .env                 # Environment variables (e.g., REACT_APP_API_URL)
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── postcss.config.js    # PostCSS configuration
├── backend/                 # Node.js/Express.js backend code
│   ├── config/              # Configuration files (e.g., database connection)
│   ├── controllers/         # Request handlers (e.g., authController, memberController)
│   ├── middleware/          # Middleware (e.g., JWT authentication, error handling)
│   ├── models/              # MongoDB schemas (e.g., User.js, Plan.js using mongoose)
│   ├── routes/              # API routes (e.g., auth.js, members.js)
│   ├── utils/               # Utility functions (e.g., email sending with nodemailer)
│   ├── uploads/             # Temporary storage for uploads (using multer)
│   ├── .env                 # Environment variables (e.g., MONGO_URI, JWT_SECRET)
│   ├── index.js             # Entry point for the backend
│   ├── package.json         # Backend dependencies
│   └── nodemon.json         # Nodemon configuration (if used)
```

### Tech Stack
- **Frontend**: React, Tailwind CSS, Redux, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (jsonwebtoken)
- **Email Service**: Nodemailer
- **Real-Time Chat**: Socket.IO
- **QR Code Generation**: qrcode
- **Charts/Graphs**: Chart.js (react-chartjs-2)
- **PDF Export**: jsPDF
- **API Client**: Axios
- **Other Tools**: Git, Cloudinary (image storage), Multer (file uploads), ESLint, Jest (testing), Framer Motion (animations), FullCalendar (scheduling), Google Generative AI, React Router, React Toastify, Redux Persist

## Contact
- **Author**   : Felix
- **Email**    : felixxplore08@gmail.com
- **GitHub**   : felixxplore
- **LinkedIn** : www.linkedin.com/in/satyam-pawar-93a800218
