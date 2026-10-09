import { Outlet } from "react-router-dom";
import AdminShell from "./components/AdminShell";

const HubAdminLayout = () => {
  return (
    <AdminShell
      title="Hub Operations"
      navItems={[
        { name: "Hub Dashboard", to: "/hub" },
        { name: "Orders", to: "/hub/orders" },
        { name: "Hub guide", to: "/hub/guide" },
      ]}
      apiDomains={[
        { name: "Orders" },
        { name: "Logistics Hubs" },
        { name: "Sub Orders" },
      ]}
    >
      <Outlet />
    </AdminShell>
  );
};

export default HubAdminLayout;
