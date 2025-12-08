import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import AuthLayout from "../layouts/AuthLayout";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import Login from "../pages/Login";
import Contact from "../pages/Contact";
import Service from "../pages/Services";
import signup from "../pages/signup";
import Doctors from "../pages/Doctors/Docters";
import Profile from "../pages/User/Profile";
import DoctorDetails from "../pages/Doctors/DoctorDetails";
import CheckoutSuccess from "../pages/CheckoutSuccess";
import AdminProfile from "../pages/Admin/AdminProfile";

export const router = createBrowserRouter([
  {
    path: "",
    Component: AuthLayout,
    children: [
      {
        path: "",
        Component: () => <Navigate to="signup" replace />,
      },
      {
        path: "signup",
        Component: signup,
      },
      {
        path: "login",
        Component: Login,
      },
    ],
  },
  {
    path: "/",
    Component: AuthenticatedLayout,
    children: [
      {
        path: "",
        Component: () => <Navigate to="home" />,
      },
      {
        path: "home",
        Component: Home,
      },
      {
        path: "contact",
        Component: Contact,
      },
      {
        path: "service",
        Component: Service,
      },
      {
        path: "doctors",
        Component: Doctors,
      },
      {
        path: "/doctor/:id",
        Component: DoctorDetails,
      },
      {
        path: "profiles",
        Component: Profile,
      },
      {
        path: "checkout-success",
        Component: CheckoutSuccess,
      },
      {
        path: "profile",
        Component: AdminProfile,
      },
    ],
  },
]);
