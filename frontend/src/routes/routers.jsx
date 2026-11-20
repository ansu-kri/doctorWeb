import React, { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/Layouts";
import AuthLayout from "../layouts/AuthLayout";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";

const Home = React.lazy(() => import("../pages/Home"));
const Login = React.lazy(() => import("../pages/Login"));
const Contact = React.lazy(() => import("../pages/Contact"));
const Service = React.lazy(() => import("../pages/Services"));
const Signup = React.lazy(() => import("../pages/signup"));
const Doctors = React.lazy(() => import("../pages/Doctors/Docters"));
const Profile = React.lazy(() => import("../pages/User/Profile"));
const DoctorDetails = React.lazy(() => import("../pages/Doctors/DoctorDetails"));
const CheckoutSuccess = React.lazy(() => import("../pages/CheckoutSuccess"));
const AdminProfile = React.lazy(() => import("../pages/Admin/AdminProfile"));
const BookAppointment = React.lazy(() => import("../pages/BookAppointment"));

const withSuspense = (Component) => (
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
      { path: "book", element: withSuspense(BookAppointment) },
      { path: "book/:id", element: withSuspense(BookAppointment) },
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
    element: <AuthenticatedLayout roles={["admin"]} />,
    children: [
      { path: "admin", element: withSuspense(AdminProfile) },
      { path: "profile", element: <Navigate to="/admin" replace /> },
    ],
  },
]);
