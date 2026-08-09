import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import NotFound from "../features/error/views/NotFound";
import Dashboard from "../features/dashboard/views/Dashboard";

import ProtectedRoute from "./ProtectedRoutes";
import AuthLayout from "../layouts/AuthLayout";
import BlankLayout from "../layouts/BlankLayout";
import { ROLES } from "../constants/roles";
import Login from "../features/auth/views/Login";
import HubAdminLayout from "../layouts/HubAdminLayout";
import HubDashboard from "../features/dashboard/views/HubDashboard";
import Unauthorized from "../features/error/views/Unauthorized";

export const appRoutes = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [{ path: "/login", element: <Login /> }],
  },

  {
    element: <ProtectedRoute />, // must be logged in
    children: [
      {
        element: (
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} />
        ),
        children: [
          {
            path: "/",
            element: <RootLayout />,
            children: [{ index: true, element: <Dashboard /> }],
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={[ROLES.HUB_ADMIN]} />,
        children: [
          {
            path: "/hub",
            element: <HubAdminLayout />,
            children: [{ index: true, element: <HubDashboard /> }],
          },
        ],
      },
      {
        element: <BlankLayout />,
        children: [{ path: "/unauthorized", element: <Unauthorized /> }],
      },
    ],
  },

  {
    element: <BlankLayout />,
    children: [{ path: "*", element: <NotFound /> }],
  },
]);
