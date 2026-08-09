import { Outlet } from "react-router-dom";
import logo from "../assets/Logo1.png";

export default function AuthLayout() {
  const environment = import.meta.env.VITE_ENVIRONMENT;
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_20%,#a4fbe055_0%,transparent_34%),radial-gradient(circle_at_85%_85%,#fda1062b_0%,transparent_30%),linear-gradient(150deg,#f6fbf9_0%,#eef8f4_45%,#fff8ef_100%)] px-4 py-6 sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-secondary/18 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-3xl border border-primary/10 bg-white/70 shadow-[0_24px_80px_-20px_rgba(0,54,37,0.35)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden flex-col justify-between border-r border-primary/10 bg-[linear-gradient(145deg,#003625_0%,#0a4e39_55%,#0b3f2f_100%)] p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#ffffff2c_0%,transparent_30%),radial-gradient(circle_at_80%_70%,#fda10633_0%,transparent_32%)]" />
          <div className="relative">
            <img src={logo} alt="Flezta logo" className="h-16 w-auto bg-white border border-white/20 rounded-full" />
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/85">
              Command center for catalog governance, order operations, and
              day-to-day admin workflows.
            </p>
          </div>

          <div className="relative grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-white/75">
                Operations
              </p>
              <p className="mt-2 text-2xl font-semibold">{environment} environment</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-white/75">
                Access
              </p>
              <p className="mt-2 text-2xl font-semibold">Secured</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-8 lg:px-10">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}
