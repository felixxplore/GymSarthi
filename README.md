# Gymsarthi - Gym Management System

## Overview
Gymsarthi is a comprehensive gym management system built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides role-based dashboards for admins, trainers, and members to streamline gym operations, including member management, class scheduling, payment tracking, and AI-powered workout/diet plans. Developed by Felix as a full-stack project to enhance gym efficiency and user engagement.

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

## Tech Stack
- **Frontend**: React, Tailwind CSS, Redux
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Email Service**: Nodemailer
- **Real-Time Chat**: [ADD: Specify library, e.g., Socket.IO]
- **QR Code Generation**: [ADD: Specify library, e.g., QRCode.js]
- **Charts/Graphs**: [ADD: Specify library, e.g., Chart.js]
- **PDF Export**: [ADD: Specify library, e.g., jsPDF]
- **API Client**: Axios
- **Other Tools**: [ADD: Specify additional tools, e.g., Git, ESLint, Vercel]

## Repository Structure
- **frontend branch**: Contains the React-based frontend code.
- **backend branch**: Contains the Node.js/Express.js backend code.
- Note: Run both branches separately to set up the full application.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud, e.g., MongoDB Atlas)
- Git
- [ADD: Specify any other requirements, e.g., Vercel account, Render account]

## Installation

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/felixxplore/GymSarthi.git
