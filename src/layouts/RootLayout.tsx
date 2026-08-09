import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* e.g. <Navbar /> */}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* e.g. <Footer /> */}
    </div>
  )
}