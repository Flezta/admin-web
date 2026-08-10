import { Outlet } from "react-router-dom";
import AdminShell from "./components/AdminShell";

const HubAdminLayout = () => {
  return (
    <AdminShell
      title="Hub Operations"
      navItems={[{ name: "Hub Dashboard", to: "/hub" }]}
      apiDomains={[
        { name: "Orders" },
        { name: "Logistics Hubs" },
        { name: "Sub Orders" },
        { name: "Payout Status" },
        { name: "Devices" },
      ]}
    >
      <Outlet />
    </AdminShell>
  );
};

export default HubAdminLayout;
