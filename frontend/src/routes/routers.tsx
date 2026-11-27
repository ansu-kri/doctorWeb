import React, { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/Layouts";
import AuthLayout from "../layouts/AuthLayout";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import AdminLayout from "../layouts/AdminLayout";

const Home = React.lazy(() => import("../pages/Home"));
const Login = React.lazy(() => import("../pages/Login"));
const Contact = React.lazy(() => import("../pages/Contact"));
const Service = React.lazy(() => import("../pages/Services"));
const Signup = React.lazy(() => import("../pages/Signup"));
const Doctors = React.lazy(() => import("../pages/Doctors/Docters"));
const Profile = React.lazy(() => import("../pages/User/Profile"));
const DoctorDetails = React.lazy(() => import("../pages/Doctors/DoctorDetails"));
const CheckoutSuccess = React.lazy(() => import("../pages/CheckoutSuccess"));
const AdminSection = React.lazy(() => import("../pages/Admin/AdminProfile"));
const AdminAccount = React.lazy(() => import("../pages/Admin/AdminAccount"));
const AdminNotifications = React.lazy(() => import("../pages/Admin/AdminNotifications"));
const AdminReports = React.lazy(() => import("../pages/Admin/AdminReports"));
const AdminSettings = React.lazy(() => import("../pages/Admin/AdminSettings"));
const Unauthorized = React.lazy(() => import("../pages/Unauthorized"));
const NotFound = React.lazy(() => import("../pages/NotFound"));
const BookAppointment = React.lazy(() => import("../pages/BookAppointment"));

const withSuspense = (Component: React.ComponentType<{}> ) => (
  <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading...</div>}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: "home", element: <Navigate to="/" replace /> },
      { path: "contact", element: withSuspense(Contact) },
      { path: "service", element: <Navigate to="/services" replace /> },
      { path: "services", element: withSuspense(Service) },
      { path: "doctors", element: withSuspense(Doctors) },
      { path: "doctors/:id", element: withSuspense(DoctorDetails) },
      { path: "doctor/:id", element: withSuspense(DoctorDetails) },
      { path: "checkout-success", element: withSuspense(CheckoutSuccess) },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "signup", element: withSuspense(Signup) },
      { path: "login", element: withSuspense(Login) },
    ],
  },
  {
    element: <AuthenticatedLayout />,
    children: [
      { path: "dashboard", element: withSuspense(Profile) },
      { path: "profiles", element: <Navigate to="/dashboard" replace /> },
    ],
  },
  {
    element: <AuthenticatedLayout roles={["patient", "doctor", "doctors"]} />,
    children: [
      { path: "book", element: withSuspense(BookAppointment) },
      { path: "book/:id", element: withSuspense(BookAppointment) },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: withSuspense(AdminSection) },
      { path: "doctors", element: withSuspense(AdminSection) },
      { path: "patients", element: withSuspense(AdminSection) },
      { path: "appointments", element: withSuspense(AdminSection) },
      { path: "specialties", element: withSuspense(AdminSection) },
      { path: "services", element: withSuspense(AdminSection) },
      { path: "profile", element: withSuspense(AdminAccount) },
      { path: "profile/settings", element: withSuspense(AdminAccount) },
      { path: "notifications", element: withSuspense(AdminNotifications) },
      { path: "reports", element: withSuspense(AdminReports) },
      { path: "settings", element: withSuspense(AdminSettings) },
      { path: "*", element: withSuspense(NotFound) },
    ],
  },
  { path: "/unauthorized", element: withSuspense(Unauthorized) },
  { path: "*", element: withSuspense(NotFound) },
]);