import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastProvider } from "./components/shared/Toast/ToastManager";

// Components
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import PublicRoute from "./components/Routes/PublicRoute";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard Pages
import DonorListForOrg from "./pages/Dashboard/DonorListForOrg";
import DonorDashboard from "./pages/Dashboard/DonorDashboard";
import DonorCapacity from "./pages/Dashboard/DonorCapacity";
import Hospitals from "./pages/Dashboard/Hospitals";
import OrganisationPage from "./pages/Dashboard/OrganisationPage";
import OrganisationSubscription from "./pages/Dashboard/OrganisationSubscription";
import DonorHome from "./pages/Dashboard/DonorHome";
import HospitalHome from "./pages/Dashboard/HospitalHome";
import OrganisationHome from "./pages/Dashboard/OrganisationHome";
import Consumer from "./pages/Dashboard/Consumer";
import Donation from "./pages/Donation";
import NewDonation from "./pages/Dashboard/NewDonation";
import Analytics from "./pages/Dashboard/Analytics";
import ComprehensiveAnalytics from "./pages/Dashboard/ComprehensiveAnalytics";
import DonorManagement from "./pages/Dashboard/DonorManagement";
import HospitalManagement from "./pages/Dashboard/HospitalManagement";

// Admin Pages
import DonorList from "./pages/Admin/DonorList";
import HospitalList from "./pages/Admin/HospitalList";
import OrgList from "./pages/Admin/OrgList";
import AdminHome from "./pages/Admin/AdminHome";
import AdminManagement from "./pages/Admin/AdminManagement";

const App = () => {
  return (
    <ToastProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <Routes>
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor-list"
          element={
            <ProtectedRoute>
              <DonorList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital-list"
          element={
            <ProtectedRoute>
              <HospitalList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/org-list"
          element={
            <ProtectedRoute>
              <OrgList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-management"
          element={
            <ProtectedRoute>
              <AdminManagement />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Routes */}
        <Route
          path="/hospital"
          element={
            <ProtectedRoute>
              <Hospitals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/comprehensive-analytics"
          element={
            <ProtectedRoute>
              <ComprehensiveAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor-management"
          element={
            <ProtectedRoute>
              <DonorManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital-management"
          element={
            <ProtectedRoute>
              <HospitalManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consumer"
          element={
            <ProtectedRoute>
              <Consumer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organisation"
          element={
            <ProtectedRoute>
              <OrganisationSubscription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor-organisation"
          element={
            <ProtectedRoute>
              <OrganisationSubscription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor"
          element={
            <ProtectedRoute>
              <DonorListForOrg />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor-dashboard"
          element={
            <ProtectedRoute>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor-capacity"
          element={
            <ProtectedRoute>
              <DonorCapacity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor-new-donation"
          element={
            <ProtectedRoute>
              <NewDonation />
            </ProtectedRoute>
          }
        />

        {/* Main Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor-home"
          element={
            <ProtectedRoute>
              <DonorHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital-home"
          element={
            <ProtectedRoute>
              <HospitalHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organisation-home"
          element={
            <ProtectedRoute>
              <OrganisationHome />
            </ProtectedRoute>
          }
        />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
      </Routes>
    </ToastProvider>
  );
};

export default App;
