# Spa Jobs App

[![Download ZIP](https://img.shields.io/badge/Download-ZIP-blue?logo=github)](https://github.com/your-repo-url/archive/refs/heads/main.zip)

---

## 🚀 Features

- **Dashboard & Analytics**: Modern dashboard with key metrics, charts, and recent activity.
- **Job Management**: Add, edit, delete, and view jobs. Filter and search jobs by category, location, and more.
- **User Authentication**: Secure login for admins and users.
- **Messaging System**: Admins can view and manage messages from users.
- **Professional HTML Email Templates**: Unified, branded, mobile-friendly templates for all notifications (job alerts, password reset, etc.) with inline CSS for maximum compatibility.
- **Admin Job Sending**: Select and send jobs to subscribers with a beautiful HTML email.
- **Job Search & Filter**: Real-time search box to filter jobs by title, category, or location.
- **Two-Column Layout**: Responsive layout for subscribers and job/email form.
- **All Jobs Fetched**: No pagination/limit for job selection.
- **Charts & Reports**: Visualize user growth, job postings, and website visits.
- **Mobile-Friendly**: All UI and emails are responsive.
- **Custom Branding**: Easily update logo and colors.
- **Inline Styles for Email**: All email templates use inline styles for best compatibility.

---

## 📸 Screenshots

> _Add your own screenshots here!_

- ![Dashboard](screenshots/dashboard.png)
- ![Job Email Example](screenshots/job-email.png)
- ![Subscribers Page](screenshots/subscribers.png)

---

## ⬇️ Download & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo-url.git
   cd job-app
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables**
   - Copy `.env.example` to `.env` and fill in your values (MongoDB, email credentials, etc.)
4. **Run the backend**
   ```bash
   cd JobBackend
   npm install
   npm start
   ```
5. **Run the frontend**
   ```bash
   cd ../job-app
   npm start
   ```

---

## 🛠️ Usage

### For Admins
- Log in to the admin panel.
- View dashboard analytics and charts.
- Manage jobs, users, and messages.
- Go to the Subscribers page to:
  - View all subscribers.
  - Search and select jobs to send.
  - Compose and send professional job alert emails.

### For Users
- Browse and apply for jobs.
- Subscribe for job alerts.
- Receive beautiful, branded job alert emails.
- Reset password via email (with branded template).

---

## ⚙️ API & Tech Stack
- **Frontend**: React, Vite, Tailwind CSS (or your CSS framework)
- **Backend**: Node.js, Express, MongoDB
- **Email**: Nodemailer (Gmail SMTP or your provider)
- **Charts**: Chart.js, Recharts
- **Authentication**: JWT-based

---

## 🎨 Customization
- **Logo**: Replace the logo URL in the email template and frontend.
- **Colors**: Update inline styles in the email template and Tailwind/CSS in the frontend.
- **Email Template**: Edit `generateJobsHtmlEmail` in `JobBackend/routes/subscribeRoute.js` and the password reset template in `JobBackend/utils/sendMail.js`.

---

## 🤝 Contributing
- Pull requests are welcome! Please use inline styles for emails and maintain the unified template.
- For major changes, open an issue first to discuss what you would like to change.

---

## 📄 License
- [MIT License](LICENSE)

---

## 💬 Support
- For help, open an issue or contact the Spa Jobs team.

---

**All emails sent by this app are designed to look great in Gmail, Outlook, and all major email clients.** 
