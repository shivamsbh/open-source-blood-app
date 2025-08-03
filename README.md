# 🩸 Blood Bank Management System

A comprehensive MERN (MongoDB, Express.js, React.js, Node.js) stack application for managing blood bank operations, connecting donors, hospitals, and organizations in an efficient blood donation ecosystem.

## 🌟 Features

### 🔐 Multi-Role Authentication System
- **Admin**: Complete system oversight and user management
- **Organization**: Blood inventory management and coordination
- **Donor**: Blood donation tracking and history
- **Hospital**: Blood request and consumption management

### 🚀 Live Demo
- **Demo URL**: [Coming Soon - Blood Bank System](https://your-demo-url.com)
- **Test Credentials**: Contact admin for demo access
- **Features Showcase**: Interactive demo with sample data

### 📱 Mobile Compatibility
- **Responsive Design**: Works seamlessly on all devices
- **Touch Optimized**: Mobile-friendly interface
- **Offline Support**: PWA capabilities for offline access
- **Cross-Platform**: Compatible with iOS, Android, and desktop browsers

### 📊 Core Functionalities
- **Blood Inventory Management**: Track blood donations and distributions
- **Real-time Analytics**: Monitor blood bank statistics and trends
- **User Management**: Role-based access control and user profiles
- **Blood Request System**: Hospitals can request specific blood types
- **Donation Tracking**: Complete history of donations and distributions
- **Responsive Design**: Mobile-friendly interface

### 🩸 Blood Type Support
- All major blood groups: O+, O-, AB+, AB-, A+, A-, B+, B-
- Quantity tracking in milliliters (ML)
- Inventory type classification (In/Out)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shivamsbh/BLOOD-BANK-PROJECT.git
   cd BLOOD-BANK-PROJECT
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   **Backend (.env in backend folder):**
   ```env
   PORT=8080
   DEV_MODE=development
   MONGO_URL=mongodb://localhost:27017/bloodbank
   JWT_SECRET=your_jwt_secret_key
   ```
   
   **Frontend (.env in client folder):**
   ```env
   REACT_APP_BASEURL=http://localhost:8080/api/v1
   ```

4. **Start the application**
   ```bash
   # From the backend directory
   npm run dev
   ```
   This will start both backend and frontend servers concurrently.

## 🏗️ Project Structure

```
BLOOD-BANK-PROJECT/
├── backend/                 # Node.js/Express.js API
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Authentication & admin middlewares
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   └── server.js          # Entry point
├── client/                 # React.js frontend
│   ├── public/            # Static assets
│   ├── src/               # React components and pages
│   └── package.json       # Frontend dependencies
└── README.md              # Project documentation
```

## 🔧 Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

### Frontend
- **React.js**: UI library
- **Redux Toolkit**: State management
- **React Router**: Navigation
- **Axios**: HTTP client
- **Bootstrap**: CSS framework
- **React Icons**: Icon library
- **Moment.js**: Date formatting

## 📱 Application Flow

### User Registration & Authentication
1. Users register with role selection (Admin/Organization/Donor/Hospital)
2. JWT-based authentication system
3. Role-based route protection

### Blood Donation Process
1. **Donors** register and provide personal information
2. **Organizations** record blood donations with quantity and blood type
3. **Inventory** is updated in real-time

### Blood Distribution
1. **Hospitals** request blood from organizations
2. **Organizations** fulfill requests and update inventory
3. **Analytics** track distribution patterns

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/current-user` - Get current user

### Inventory Management
- `POST /api/v1/inventory/create-inventory` - Add blood record
- `GET /api/v1/inventory/get-inventory` - Get all blood records
- `GET /api/v1/inventory/get-recent-inventory` - Get recent records

### User Management
- `GET /api/v1/inventory/get-donors` - Get all donors
- `GET /api/v1/inventory/get-hospitals` - Get all hospitals
- `GET /api/v1/inventory/get-organisation` - Get all organizations

### Analytics
- `GET /api/v1/analytics/bloodGroups-data` - Blood group analytics

### Admin
- `GET /api/v1/admin/donor-list` - Admin donor management
- `GET /api/v1/admin/hospital-list` - Admin hospital management
- `GET /api/v1/admin/org-list` - Admin organization management

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Role-based Access Control**: Different permissions for each user type
- **Input Validation**: Mongoose schema validation
- **CORS Protection**: Configured cross-origin resource sharing

## 🎨 User Interface

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Intuitive Navigation**: Role-based sidebar menus
- **Real-time Updates**: Live inventory and analytics
- **Toast Notifications**: User feedback for actions
- **Modal Forms**: Clean data entry interfaces

## 📊 Analytics & Reporting

- Blood group distribution charts
- Donation trends over time
- Hospital consumption patterns
- Donor activity tracking
- Inventory level monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

- GitHub: [@shivamsbh](https://github.com/shivamsbh)
- LinkedIn: [Connect with the developer](https://www.linkedin.com/in/shivam-saurabh-b5bb22279/)
- Email: [Contact for collaboration](mailto:rasitak195@gmail.com)

## 🌟 Acknowledgments

- Thanks to all blood donors who inspire this project
- Healthcare workers who save lives daily
- Open source community for amazing tools and libraries
- Beta testers and early adopters for valuable feedback

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed description
3. Provide steps to reproduce the problem

## 🔮 Future Enhancements

### Phase 1 - Immediate Improvements
- [ ] Email notifications for low inventory
- [ ] SMS alerts for urgent blood requests
- [ ] Advanced search and filtering
- [ ] Export data to PDF/Excel

### Phase 2 - Advanced Features
- [ ] Mobile app development (React Native)
- [ ] Advanced analytics dashboard with charts
- [ ] Integration with hospital management systems
- [ ] Real-time chat support

### Phase 3 - AI & Automation
- [ ] Geolocation-based donor matching
- [ ] AI-powered demand prediction
- [ ] Automated inventory alerts
- [ ] Smart donor scheduling

### Phase 4 - Extended Ecosystem
- [ ] Blood camp management
- [ ] Donor health tracking
- [ ] Integration with government health systems
- [ ] Multi-language support

---

**Made with ❤️ for saving lives through technology**