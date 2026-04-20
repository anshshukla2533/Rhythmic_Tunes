import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { PlayerBar } from './PlayerBar';

export function AppShell() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto scrollbar-thin">
          <Outlet />
        </main>
      </div>
      <PlayerBar />
    </div>
  );
}
