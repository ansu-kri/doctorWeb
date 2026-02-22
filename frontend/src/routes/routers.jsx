import React, { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// Lazy imports
const Home = React.lazy(() => import("../pages/Home"));
const AuthLayout = React.lazy(() => import("../layouts/AuthLayout"));
const AuthenticatedLayout = React.lazy(() => import("../layouts/AuthenticatedLayout"));
const Login = React.lazy(() => import("../pages/Login"));
const Contact = React.lazy(() => import("../pages/Contact"));
const Service = React.lazy(() => import("../pages/Services"));
const Signup = React.lazy(() => import("../pages/signup"));
const Doctors = React.lazy(() => import("../pages/Doctors/Docters"));
const Profile = React.lazy(() => import("../pages/User/Profile"));
const DoctorDetails = React.lazy(() => import("../pages/Doctors/DoctorDetails"));
const CheckoutSuccess = React.lazy(() => import("../pages/CheckoutSuccess"));
const AdminProfile = React.lazy(() => import("../pages/Admin/AdminProfile"));

// Reusable Suspense Wrapper
const withSuspense = (Component) => (
  <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "",
    element: withSuspense(AuthLayout),
    children: [
      {
        index: true,
        element: <Navigate to="signup" replace />,
      },
      {
        path: "signup",
        element: withSuspense(Signup),
      },
      {
        path: "login",
        element: withSuspense(Login),
      },
    ],
  },
  {
    path: "/",
    element: withSuspense(AuthenticatedLayout),
    children: [
      {
        index: true,
        element: <Navigate to="home" replace />,
      },
      {
        path: "home",
        element: withSuspense(Home),
      },
      {
        path: "contact",
        element: withSuspense(Contact),
      },
      {
        path: "service",
        element: withSuspense(Service),
      },
      {
        path: "doctors",
        element: withSuspense(Doctors),
      },
      {
        path: "doctor/:id",  
        element: withSuspense(DoctorDetails),
      },
      {
        path: "profiles",
        element: withSuspense(Profile),
      },
      {
        path: "checkout-success",
        element: withSuspense(CheckoutSuccess),
      },
      {
        path: "profile",
        element: withSuspense(AdminProfile),
      },
    ],
  },
]);