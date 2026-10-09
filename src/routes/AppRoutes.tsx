import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import NotFound from "../features/error/views/NotFound";
import Dashboard from "../features/dashboard/views/Dashboard";

import ProtectedRoute from "./ProtectedRoutes";
import AuthLayout from "../layouts/AuthLayout";
import BlankLayout from "../layouts/BlankLayout";
import { ROLES } from "../constants/roles";
import Login from "../features/auth/views/Login";
import SignUp from "../features/auth/views/SignUp";
import HubAdminLayout from "../layouts/HubAdminLayout";
import HubDashboard from "../features/dashboard/views/HubDashboard";
import Unauthorized from "../features/error/views/Unauthorized";
import UsersList from "../features/users/views/UsersList";
import UserDetails from "../features/users/views/UserDetails";
import ShopsList from "../features/shops/views/ShopsList";
import ShopDetails from "../features/shops/views/ShopDetails";
import ProductsList from "../features/products/views/ProductsList";
import ProductDetails from "../features/products/views/ProductDetails";
import OrdersList from "../features/orders/views/OrdersList";
import OrderDetails from "../features/orders/views/OrderDetails";
import HubsList from "../features/hubs/views/HubsList";
import HubDetails from "../features/hubs/views/HubDetails";
import HubAdminGuide from "../features/hubs/views/HubAdminGuide";
import PaymentsList from "../features/payments/views/PaymentsList";
import PaymentDetails from "../features/payments/views/PaymentDetails";

export const appRoutes = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
    ],
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
            children: [
              { index: true, element: <Dashboard /> },
              { path: "users", element: <UsersList /> },
              { path: "users/:uid", element: <UserDetails /> },
              { path: "shops", element: <ShopsList /> },
              { path: "shops/:shopId", element: <ShopDetails /> },
              { path: "products", element: <ProductsList /> },
              { path: "products/:productId", element: <ProductDetails /> },
              { path: "orders", element: <OrdersList /> },
              { path: "orders/:id", element: <OrderDetails /> },
              { path: "payments", element: <PaymentsList /> },
              { path: "payments/buyers/:id", element: <PaymentDetails /> },
              {
                path: "payments/vendors/:id",
                element: <PaymentDetails vendor />,
              },
              {
                element: <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]} />,
                children: [
                  { path: "hubs", element: <HubsList /> },
                  { path: "hubs/:hubId", element: <HubDetails /> },
                ],
              },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={[ROLES.HUB_ADMIN]} />,
        children: [
          {
            path: "/hub",
            element: <HubAdminLayout />,
            children: [
              { index: true, element: <HubDashboard /> },
              { path: "guide", element: <HubAdminGuide /> },
              { path: "orders", element: <OrdersList hubOnly /> },
              { path: "orders/:id", element: <OrderDetails hubOnly /> },
            ],
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
