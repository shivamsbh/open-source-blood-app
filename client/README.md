# 🩸 Blood Bank Frontend Client

A modern React.js frontend application for the Blood Bank Management System, providing an intuitive user interface for donors, hospitals, organizations, and administrators.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Backend API server running

### Installation

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create/update `.env` file in the client directory:
   ```env
   REACT_APP_BASEURL=http://localhost:8080/api/v1
   ```

4. **Start the application**
   ```bash
   npm start
   ```
   The application will open at `http://localhost:3000`

## 📁 Project Structure

```
client/
├── public/
│   ├── assets/
│   │   └── images/           # Banner images
│   ├── favicon.ico
│   ├── index.html           # Main HTML template
│   └── manifest.json        # PWA configuration
├── src/
│   ├── components/
│   │   ├── Routes/          # Route protection components
│   │   └── shared/          # Reusable components
│   │       ├── Form/        # Form components
│   │       ├── Layout/      # Layout components
│   │       └── Modal/       # Modal components
│   ├── pages/
│   │   ├── Admin/           # Admin pages
│   │   ├── auth/            # Authentication pages
│   │   └── Dashboard/       # Dashboard pages
│   ├── redux/
│   │   ├── features/        # Redux slices
│   │   └── store.js         # Redux store configuration
│   ├── services/            # API services
│   ├── styles/              # CSS stylesheets
│   ├── App.js               # Main App component
│   └── index.js             # Application entry point
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## 🔧 Dependencies

### Core React Libraries
- **react**: UI library (v18.2.0)
- **react-dom**: DOM rendering
- **react-router-dom**: Client-side routing
- **react-scripts**: Build tools and configuration

### State Management
- **@reduxjs/toolkit**: Modern Redux toolkit
- **react-redux**: React-Redux bindings

### UI Components & Styling
- **react-icons**: Icon library
- **react-toastify**: Toast notifications
- **moment**: Date formatting and manipulation
- **Bootstrap**: CSS framework (via CDN)

### HTTP Client
- **axios**: Promise-based HTTP client

### Testing
- **@testing-library/react**: React testing utilities
- **@testing-library/jest-dom**: Jest DOM matchers
- **@testing-library/user-event**: User interaction testing

## 🎨 Component Architecture

### Layout Components

#### `Layout.js`
Main layout wrapper with header and sidebar navigation
```javascript
<Layout>
  <Header />
  <Sidebar />
  <main>{children}</main>
</Layout>
```

#### `Header.js`
Top navigation bar with user info and logout functionality

#### `Sidebar.js`
Role-based navigation menu with different options for each user type

### Route Protection

#### `ProtectedRoute.js`
Ensures user authentication before accessing protected pages
```javascript
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

#### `PublicRoute.js`
Redirects authenticated users away from auth pages
```javascript
<PublicRoute>
  <LoginPage />
</PublicRoute>
```

### Form Components

#### `Form.js`
Reusable form wrapper with consistent styling

#### `InputType.js`
Standardized input component with validation

### Shared Components

#### `Modal.js`
Reusable modal component for forms and confirmations

#### `Spinner.js`
Loading spinner component

## 📱 Pages & Features

### Authentication Pages

#### Login (`/login`)
- Email/password authentication
- Role-based redirection
- Form validation
- Error handling

#### Register (`/register`)
- Multi-role registration (Admin, Organisation, Donor, Hospital)
- Dynamic form fields based on role
- Input validation
- Success/error feedback

### Dashboard Pages

#### Home Page (`/`)
- Blood inventory overview
- Add inventory modal
- Recent transactions table
- Role-based content

#### Analytics (`/analytics`)
- Blood group distribution charts
- Donation trends
- Statistical insights
- Visual data representation

#### Donor Dashboard (`/donor`)
- Personal donation history
- Upcoming appointments
- Profile management

#### Hospital Dashboard (`/hospital`)
- Blood request functionality
- Available inventory view
- Request history

#### Organisation Dashboard (`/organisation`)
- Inventory management
- Donor coordination
- Hospital requests

#### Consumer Dashboard (`/consumer`)
- Blood consumption tracking
- Request management

### Admin Pages

#### Admin Home (`/admin`)
- System overview
- User statistics
- Quick actions

#### Donor List (`/donor-list`)
- All registered donors
- Donor management
- Search and filter

#### Hospital List (`/hospital-list`)
- All registered hospitals
- Hospital management
- Contact information

#### Organisation List (`/org-list`)
- All registered organisations
- Organisation management
- Coordination tools

## 🔄 State Management (Redux)

### Store Configuration (`store.js`)
```javascript
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});
```

### Auth Slice (`authSlice.js`)
- User authentication state
- Login/logout actions
- User profile data
- Loading states

### Auth Actions (`authActions.js`)
- Login action creator
- Register action creator
- Current user fetching
- Logout functionality

## 🌐 API Integration

### API Service (`API.js`)
Centralized Axios configuration with:
- Base URL configuration
- Request interceptors for authentication
- Response interceptors for error handling

```javascript
import axios from 'axios';

const API = axios.create({ 
  baseURL: process.env.REACT_APP_BASEURL 
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});
```

### Auth Service (`authService.js`)
Authentication-specific API calls:
- Login requests
- Registration requests
- Token management

## 🎯 Routing Structure

```javascript
<Routes>
  {/* Admin Routes */}
  <Route path="/admin" element={<ProtectedRoute><AdminHome /></ProtectedRoute>} />
  <Route path="/donor-list" element={<ProtectedRoute><DonorList /></ProtectedRoute>} />
  <Route path="/hospital-list" element={<ProtectedRoute><HospitalList /></ProtectedRoute>} />
  <Route path="/org-list" element={<ProtectedRoute><OrgList /></ProtectedRoute>} />
  
  {/* Dashboard Routes */}
  <Route path="/hospital" element={<ProtectedRoute><Hospitals /></ProtectedRoute>} />
  <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
  <Route path="/consumer" element={<ProtectedRoute><Consumer /></ProtectedRoute>} />
  <Route path="/donation" element={<ProtectedRoute><Donation /></ProtectedRoute>} />
  <Route path="/organisation" element={<ProtectedRoute><OrganisationPage /></ProtectedRoute>} />
  <Route path="/donor" element={<ProtectedRoute><Donor /></ProtectedRoute>} />
  
  {/* Main Routes */}
  <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
  
  {/* Auth Routes */}
  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
  <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
</Routes>
```

## 🎨 Styling & UI

### CSS Framework
- **Bootstrap 5**: Responsive grid system and components
- **Custom CSS**: Additional styling in `src/styles/`
- **React Icons**: Consistent iconography

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Flexible grid layouts
- Touch-friendly interfaces

### Theme & Colors
- Medical/healthcare color scheme
- Consistent branding
- Accessibility considerations
- Professional appearance

## 🔧 Development Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (irreversible)
npm run eject
```

## 🌐 Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `REACT_APP_BASEURL` | Backend API base URL | `http://localhost:8080/api/v1` | ✅ |

## 🚀 Build & Deployment

### Production Build
```bash
npm run build
```
Creates optimized production build in `build/` directory.

### Deployment Options
1. **Static Hosting**: Netlify, Vercel, GitHub Pages
2. **CDN**: AWS CloudFront, Azure CDN
3. **Traditional Hosting**: Apache, Nginx
4. **Container**: Docker deployment

### Environment-Specific Builds
```bash
# Development
REACT_APP_BASEURL=http://localhost:8080/api/v1 npm run build

# Production
REACT_APP_BASEURL=https://api.yourbloodbank.com/api/v1 npm run build
```

## 🧪 Testing

### Test Structure
```
src/
├── components/
│   └── __tests__/
├── pages/
│   └── __tests__/
└── services/
    └── __tests__/
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 📱 Progressive Web App (PWA)

The application includes PWA features:
- **Service Worker**: Offline functionality
- **Web App Manifest**: Install on mobile devices
- **Responsive Design**: Mobile-optimized interface

## 🔧 Customization

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `App.js`
3. Update navigation in `Sidebar.js`
4. Add any required Redux state

### Styling Customization
1. Modify `src/styles/Layout.css`
2. Add component-specific CSS files
3. Update Bootstrap variables
4. Customize color scheme

## 🐛 Troubleshooting

### Common Issues
1. **API Connection**: Check REACT_APP_BASEURL
2. **CORS Errors**: Ensure backend CORS configuration
3. **Authentication**: Verify token storage and headers
4. **Build Errors**: Check for missing dependencies

### Debug Mode
```bash
# Enable React debug mode
REACT_APP_DEBUG=true npm start
```

## 📈 Performance Optimization

- **Code Splitting**: React.lazy() for route-based splitting
- **Memoization**: React.memo for expensive components
- **Bundle Analysis**: webpack-bundle-analyzer
- **Image Optimization**: Compressed assets
- **Caching**: Service worker caching strategies

## 🔄 State Management Best Practices

- **Normalized State**: Flat state structure
- **Immutable Updates**: Redux Toolkit's Immer
- **Async Actions**: Redux Toolkit Query (future enhancement)
- **Error Handling**: Consistent error state management

---

**Frontend ready to provide an amazing user experience! 🎨**