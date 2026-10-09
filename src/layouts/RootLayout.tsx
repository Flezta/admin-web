import { Outlet } from "react-router-dom";
import AdminShell from "./components/AdminShell";
import { useAuth } from "../features/auth/context/use-auth";

export default function RootLayout() {
  const { user } = useAuth();
  return (
    <AdminShell
      title="Marketplace Control"
      navItems={[
        { name: "Dashboard", to: "/" },
        { name: "Users", to: "/users" },
        { name: "Shops", to: "/shops" },
        { name: "Products", to: "/products" },
        { name: "Orders", to: "/orders" },
        { name: "Payments", to: "/payments" },
        ...(user?.isSuperAdmin ? [{ name: "Partner hubs", to: "/hubs" }] : []),
      ]}
      apiDomains={[
        { name: "Users" },
        { name: "Shops" },
        { name: "Products" },
        { name: "Categories" },
        { name: "Brands" },
        { name: "Orders" },
        { name: "Hubs" },
        { name: "Payments" },
        { name: "Moderation" },
        { name: "Payouts" },
        { name: "Notifications" },
        { name: "Help Center" },
      ]}
    >
      <main>
        <Outlet />
      </main>
    </AdminShell>
  );
}
