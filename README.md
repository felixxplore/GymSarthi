Gymsarthi - Gym Management System
Overview
Gymsarthi is a comprehensive gym management system built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides role-based dashboards for admins, trainers, and members to streamline gym operations, including member management, class scheduling, payment tracking, and AI-powered workout/diet plans. Developed by Felix as a full-stack project to enhance gym efficiency and user engagement.
Features
Admin Dashboard

Admin Profile: Update personal information and upload profile image.
Trainer Management: Create, edit, delete trainers, and display a list of trainers.
User Management: View lists of plan-purchased and non-plan members, with the ability to delete members.
Plan Management: Create, edit, delete membership plans, and showcase available plans.
Payment History: Display all transactions, filter by criteria, and export to PDF for download.
Analytics: Visualize user signup growth, plan purchases, and monthly revenue with interactive graphs.
Class Management: Create classes (e.g., Zumba, Yoga) and view schedules in a calendar (today, day, week, month).
QR Code: Generate downloadable QR code for member attendance, automatically refreshes every 24 hours.

Trainer Dashboard

Trainer Profile: Edit profile details and upload profile photo.
My Plans: View assigned plans and their member lists, assign tasks to specific members.
Each plan is linked to a trainer; members purchasing a plan are auto-assigned to the trainer’s member list.


Class Schedule: Display all classes linked to the trainer for easy scheduling.

Member Dashboard

Member Profile: Update profile information and upload profile image.
Trainer Profile: View details of the assigned trainer.
Plan Purchased: Display details of purchased membership plans.
Daily Tasks: View tasks assigned by the trainer.
Payment History: View all transactions, filter, and export to PDF.
Class Booking: Browse and book available classes.
Pending Payments: Pay pending dues, view remaining balance, and past payment history.
Attendance Calendar: Track attendance history in a calendar and scan QR codes for check-in.
Plan Purchase: Purchase plans, receive email confirmation with invoice from admin.
AI Workout & Diet Plan: Generate personalized workout and diet plans by filling out a form.
Chat: Real-time chat for members, trainers, and admins, with image-sharing support.

Tech Stack

Frontend: React, Tailwind CSS, Redux
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JWT
Email Service: Nodemailer
Real-Time Chat: [ADD: Specify library, e.g., Socket.IO]
QR Code Generation: [ADD: Specify library, e.g., QRCode.js]
Charts/Graphs: [ADD: Specify library, e.g., Chart.js]
PDF Export: [ADD: Specify library, e.g., jsPDF]
API Client: Axios
Other Tools: [ADD: Specify additional tools, e.g., Git, Docker]

Prerequisites

Node.js (v16 or higher)
MongoDB (local or cloud, e.g., MongoDB Atlas)
Git
[ADD: Specify any other requirements, e.g., specific npm packages or cloud service accounts]

Installation
Backend Setup

Clone the repository:git clone https://github.com/felixxplore/GymSarthi.git


Navigate to the backend branch:cd GymSarthi/backend


Install dependencies:npm install


Create a .env file in the backend directory and add the following:MONGO_URI=[ADD: Your MongoDB connection string]
JWT_SECRET=[ADD: Your JWT secret key]
EMAIL_USER=[ADD: Your email address for Nodemailer]
EMAIL_PASS=[ADD: Your email password or app-specific password]
[ADD: Any other environment variables, e.g., API keys]


Start the backend server:npm start



Frontend Setup

Navigate to the frontend branch:cd ../frontend


Install dependencies:npm install


Create a .env file in the frontend directory and add:REACT_APP_API_URL=http://localhost:5000/api
[ADD: Any other frontend environment variables]


Start the frontend development server:npm start



Usage

Access the app at http://localhost:3000 or the live demo: [ADD: Insert live demo link, e.g., https://gymsarthi.vercel.app]
Log in with the following roles:
Admin: Manage trainers, members, plans, payments, and analytics.
Trainer: View schedules, assign tasks, and manage member lists.
Member: Book classes, track tasks, pay dues, and use AI workout plans.


Use the QR code feature for attendance or the chat system for communication.

Screenshots
[ADD: Upload screenshots to a screenshots folder in the repo]
Contributing

Fork the repository.
Create a feature branch:git checkout -b feature-name


Commit your changes:git commit -m 'Add feature'


Push to the branch:git push origin feature-name


Open a pull request.

Future Enhancements

Develop a mobile app using React Native for iOS and Android.
Add video streaming for virtual classes using WebRTC or a third-party service.
Integrate fitness wearables (e.g., Fitbit, Apple Watch) to sync workout data.
Enhance AI workout/diet plans with machine learning (e.g., TensorFlow.js).
Support multiple languages (e.g., Hindi, Tamil) for broader accessibility.

License
MIT License
Contact

Author: Felix
Email: felixxplore08@gmail.com
GitHub: felixxplore
LinkedIn: [ADD: Your LinkedIn profile URL]

