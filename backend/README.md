# 🩸 Blood Bank Backend API

A robust Node.js/Express.js REST API for the Blood Bank Management System, providing secure endpoints for user authentication, inventory management, and analytics.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   PORT=8080
   DEV_MODE=development
   MONGO_URL=mongodb://localhost:27017/bloodbank
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run server
   
   # Start both backend and frontend
   npm run dev
   
   # Start only frontend from backend
   npm run client
   ```

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   ├── adminController.js    # Admin management logic
│   ├── analyticsController.js # Analytics and reporting
│   ├── authController.js     # Authentication logic
│   ├── inventoryController.js # Blood inventory management
│   └── testController.js     # API testing endpoints
├── middlewares/
│   ├── adminMiddleware.js    # Admin role verification
│   └── authMiddleware.js     # JWT token verification
├── models/
│   ├── inventoryModel.js     # Blood inventory schema
│   └── userModel.js          # User schema with roles
├── routes/
│   ├── adminRoutes.js        # Admin management routes
│   ├── analyticsRoutes.js    # Analytics endpoints
│   ├── authRoutes.js         # Authentication routes
│   ├── inventoryRoutes.js    # Inventory management routes
│   └── testRoutes.js         # Testing routes
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── package-lock.json        # Dependency lock file
└── server.js                # Application entry point
```

## 🔧 Dependencies

### Core Dependencies
- **express**: Web framework for Node.js
- **mongoose**: MongoDB object modeling
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing
- **morgan**: HTTP request logger
- **colors**: Console output styling

### Authentication & Security
- **jsonwebtoken**: JWT token generation and verification
- **bcryptjs**: Password hashing and comparison

### Development
- **nodemon**: Auto-restart server on file changes
- **concurrently**: Run multiple npm scripts simultaneously

## 🗄️ Database Models

### User Model (`userModel.js`)
```javascript
{
  role: String,              // "admin", "organisation", "donor", "hospital"
  name: String,              // Required for donor/admin
  organisationName: String,  // Required for organisation
  hospitalName: String,      // Required for hospital
  email: String,             // Unique, required
  password: String,          // Hashed, min 6 characters
  website: String,           // Optional
  address: String,           // Required
  phone: String,             // Required, validated format
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

### Inventory Model (`inventoryModel.js`)
```javascript
{
  inventoryType: String,     // "in" or "out"
  bloodGroup: String,        // "O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"
  quantity: Number,          // Blood quantity in ML
  email: String,             // Donor email
  organisation: ObjectId,    // Reference to User (organisation)
  hospital: ObjectId,        // Reference to User (hospital) - for "out" type
  donor: ObjectId,           // Reference to User (donor) - for "in" type
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

## 🛣️ API Routes

### Authentication Routes (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | User registration | ❌ |
| POST | `/login` | User login | ❌ |
| GET | `/current-user` | Get current user info | ✅ |

### Inventory Routes (`/api/v1/inventory`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/create-inventory` | Add blood record | ✅ |
| GET | `/get-inventory` | Get all blood records | ✅ |
| GET | `/get-recent-inventory` | Get recent blood records | ✅ |
| POST | `/get-inventory-hospital` | Get hospital blood records | ✅ |
| GET | `/get-donors` | Get all donors | ✅ |
| GET | `/get-hospitals` | Get all hospitals | ✅ |
| GET | `/get-organisation` | Get all organisations | ✅ |
| GET | `/get-organisation-for-hospital` | Get organisations for hospital | ✅ |

### Analytics Routes (`/api/v1/analytics`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/bloodGroups-data` | Blood group analytics | ✅ |

### Admin Routes (`/api/v1/admin`)
| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/donor-list` | Get all donors (admin) | ✅ | ✅ |
| GET | `/hospital-list` | Get all hospitals (admin) | ✅ | ✅ |
| GET | `/org-list` | Get all organisations (admin) | ✅ | ✅ |
| DELETE | `/delete-donor/:id` | Delete donor | ✅ | ✅ |

### Test Routes (`/api/v1/test`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | API health check | ❌ |

## 🔐 Authentication & Authorization

### JWT Authentication
- **Token Generation**: On successful login
- **Token Verification**: Required for protected routes
- **Token Format**: `Bearer <token>`
- **Token Storage**: Client-side (localStorage)

### Role-Based Access Control
- **Admin**: Full system access, user management
- **Organisation**: Inventory management, donor/hospital data
- **Donor**: View own donation history
- **Hospital**: Request blood, view available inventory

### Middleware Functions
- **authMiddleware**: Verifies JWT token
- **adminMiddleware**: Ensures admin role access

## 🛡️ Security Features

### Password Security
- **Hashing**: bcryptjs with salt rounds
- **Validation**: Minimum 6 characters
- **Storage**: Never store plain text passwords

### Data Validation
- **Email**: Format validation and uniqueness
- **Phone**: Format validation
- **Required Fields**: Schema-level validation
- **Enum Values**: Restricted role and blood group values

### CORS Configuration
- **Origin**: Configurable for different environments
- **Methods**: GET, POST, PUT, DELETE
- **Headers**: Authorization, Content-Type

## 📊 Error Handling

### Standard Error Responses
```javascript
{
  success: false,
  message: "Error description",
  error: "Detailed error information"
}
```

### Success Responses
```javascript
{
  success: true,
  message: "Operation successful",
  data: { /* Response data */ }
}
```

## 🔧 Development Scripts

```bash
# Start server with nodemon (development)
npm run server

# Start frontend from backend directory
npm run client

# Start both backend and frontend concurrently
npm run dev

# Run tests (if configured)
npm test
```

## 🌐 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 8080 | ❌ |
| `DEV_MODE` | Development mode | development | ❌ |
| `MONGO_URL` | MongoDB connection string | - | ✅ |
| `JWT_SECRET` | JWT signing secret | - | ✅ |

## 📝 API Usage Examples

### User Registration
```javascript
POST /api/v1/auth/register
Content-Type: application/json

{
  "role": "donor",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": "123 Main St, City"
}
```

### User Login
```javascript
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Add Blood Inventory
```javascript
POST /api/v1/inventory/create-inventory
Authorization: Bearer <token>
Content-Type: application/json

{
  "inventoryType": "in",
  "bloodGroup": "O+",
  "quantity": 500,
  "email": "donor@example.com"
}
```

## 🚀 Deployment

### Production Environment
1. Set `NODE_ENV=production`
2. Use production MongoDB URL
3. Configure secure JWT secret
4. Enable HTTPS
5. Set up proper CORS origins

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
```

## 🐛 Troubleshooting

### Common Issues
1. **MongoDB Connection**: Check MONGO_URL in .env
2. **JWT Errors**: Verify JWT_SECRET is set
3. **CORS Issues**: Configure proper origins
4. **Port Conflicts**: Change PORT in .env

### Debug Mode
```bash
DEBUG=* npm run server
```

## 📈 Performance Optimization

- **Database Indexing**: Email and role indexes
- **Connection Pooling**: Mongoose default settings
- **Middleware Optimization**: Efficient route handling
- **Error Handling**: Proper error catching and responses

## 🔄 API Versioning

Current version: `v1`
- All routes prefixed with `/api/v1`
- Future versions will maintain backward compatibility

---

**Backend API ready to power your Blood Bank Management System! 🩸**