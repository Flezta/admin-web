import { useMemo, useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo1.png";
import { useAuth } from "../../features/auth/context/use-auth";

type NavItem = {
  name: string;
  to: string;
};

type ApiDomain = {
  name: string;
};

interface AdminShellProps {
  title: string;
  navItems: NavItem[];
  apiDomains: ApiDomain[];
  children: ReactNode;
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M9 4h-3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 17l5-5-5-5M21 12H9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AdminShell({
  title,
  navItems,
  apiDomains,
  children,
}: AdminShellProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const initials = useMemo(() => {
    const source =
      user?.firstName || user?.userName || user?.email?.split("@")[0] || "A";
    return source.slice(0, 2).toUpperCase();
  }, [user]);

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.userName ||
    user?.email ||
    "Admin";

  const onLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_0%_0%,#a4fbe048_0%,transparent_30%),radial-gradient(circle_at_100%_100%,#fda10633_0%,transparent_30%),linear-gradient(165deg,#f6fbf9_0%,#eef9f5_48%,#fff9f1_100%)] text-primary">
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-white text-primary transition hover:bg-primary/5 lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <img
                src={logo}
                alt="Flezta"
                className="h-10 w-10 rounded-full border border-primary/10 bg-white p-1"
              />
              <div>
                <p className="text-sm font-semibold leading-4">Flezta Admin</p>
                <p className="text-xs text-primary/60">{title}</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="text-xs uppercase tracking-[0.14em] text-primary/55">
                Signed in as
              </p>
              <p className="text-sm font-semibold text-primary">{fullName}</p>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-full border border-primary/20 bg-primary text-xs font-bold text-white">
              {initials}
            </div>

            <button
              type="button"
              onClick={onLogout}
              disabled={loggingOut}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-primary/15 bg-white px-3 text-sm font-semibold text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogoutIcon />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full  grid-cols-1 gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6 lg:px-8 lg:py-6">
        {menuOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-20 bg-primary/35 backdrop-blur-[1px] lg:hidden"
          />
        )}

        <aside
          className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-[86%] max-w-[290px] overflow-y-auto border-r border-primary/10 bg-white/95 p-4 shadow-2xl backdrop-blur-lg transition-transform duration-300 lg:static lg:z-auto lg:h-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:rounded-3xl lg:border lg:shadow-[0_20px_55px_-30px_rgba(0,54,37,0.45)] ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <section>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary/55">
              Navigation
            </p>
            <nav className="mt-3 space-y-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-primary/5 text-primary hover:bg-primary/10"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </section>

          <section className="mt-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary/55">
              API Feature Domains
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {apiDomains.map((feature) => (
                <span
                  key={feature.name}
                  className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"
                >
                  {feature.name}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-secondary/25 bg-secondary-very-light p-3.5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary-dark">
              Operations Tip
            </p>
            <p className="mt-1.5 text-sm leading-6 text-secondary-dark/90">
              Keep product, brand, and category updates aligned before approving
              listings to reduce moderation rework.
            </p>
          </section>
        </aside>

        <div className="min-w-0">
          <main className="rounded-3xl border border-primary/10 bg-white/92 p-4 shadow-[0_20px_55px_-30px_rgba(0,54,37,0.45)] backdrop-blur-xl sm:p-6 lg:p-8">
            {children}
          </main>

          <footer className="mt-4 rounded-2xl border border-primary/10 bg-white/70 px-4 py-3 text-xs text-primary/70 backdrop-blur sm:flex sm:items-center sm:justify-between sm:text-sm">
            <p>Flezta Admin Console</p>
            <p className="mt-1 sm:mt-0">
              Built for commerce operations, moderation, and marketplace
              control.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
