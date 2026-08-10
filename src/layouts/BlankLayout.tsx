import { Outlet } from "react-router-dom";

export default function BlankLayout() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_20%,#a4fbe055_0%,transparent_34%),radial-gradient(circle_at_85%_85%,#fda1062b_0%,transparent_30%),linear-gradient(150deg,#f6fbf9_0%,#eef8f4_45%,#fff8ef_100%)] px-4 py-6 sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-secondary/18 blur-3xl" />

      <div className="relative flex min-h-[calc(100vh-3rem)] items-center justify-center">
        <div className="w-full max-w-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
