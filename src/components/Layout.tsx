import { Outlet, NavLink } from 'react-router-dom';

export function Layout() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 transition-colors duration-200 ${
      isActive
        ? 'text-black border-b-2 border-black'
        : 'text-gray-500 hover:text-black'
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">Cho Training</h1>
            <nav className="flex gap-1">
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/log" className={linkClass}>
                Log
              </NavLink>
              <NavLink to="/stats" className={linkClass}>
                Stats
              </NavLink>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
