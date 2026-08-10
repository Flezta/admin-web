import { Outlet } from "react-router-dom";
import AdminShell from "./components/AdminShell";

export default function RootLayout() {
  return (
    <AdminShell
      title="Marketplace Control"
      navItems={[
        { name: "Dashboard", to: "/" },
        { name: "Users", to: "/users" },
        { name: "Shops", to: "/shops" },
      ]}
      apiDomains={[
        { name: "Users" },
        { name: "Shops" },
        { name: "Products" },
        { name: "Categories" },
        { name: "Brands" },
        { name: "Orders" },
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
