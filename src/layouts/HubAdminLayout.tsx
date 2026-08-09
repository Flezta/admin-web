import { Outlet } from "react-router-dom";

const HubAdminLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Outlet />
    </div>
  );
};

export default HubAdminLayout;
