import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Library, LogIn, LogOut, Music2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { usePlaylists } from '@/hooks/useUserData';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/library', label: 'Your Library', icon: Library },
];

export function Sidebar() {
  const { user, signOut } = useAuth();
  const { playlists, create } = usePlaylists();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const onCreate = async () => {
    if (!name.trim()) return;
    const p = await create(name.trim(), desc.trim() || undefined);
    setOpen(false); setName(''); setDesc('');
    if (p?.id) nav(`/playlist/${p.id}`);
  };

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-full p-3 gap-3">
      <div className="glass-card rounded-2xl p-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <Music2 className="size-5 text-primary-foreground" />
          </div>
          <div className="font-display text-lg font-bold tracking-tight">RhythmicTunes</div>
        </Link>
      </div>

      <nav className="glass-card rounded-2xl p-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors',
              isActive ? 'bg-surface-2 text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-surface-2/60'
            )}
          >
            <Icon className="size-5" />{label}
          </NavLink>
        ))}
      </nav>

      <div className="glass-card rounded-2xl p-3 flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between px-2 pb-2">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Playlists</div>
          {user && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button aria-label="New playlist" className="text-muted-foreground hover:text-foreground">
                  <Plus className="size-4" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New playlist</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                  <Input placeholder="Description (optional)" value={desc} onChange={e => setDesc(e.target.value)} />
                </div>
                <DialogFooter>
                  <Button variant="hero" onClick={onCreate}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="overflow-y-auto scrollbar-thin space-y-1 pr-1">
          {!user && <p className="text-sm text-muted-foreground px-2 py-1">Sign in to create playlists.</p>}
          {playlists.map(p => (
            <NavLink
              key={p.id}
              to={`/playlist/${p.id}`}
              className={({ isActive }) => cn(
                'block px-3 py-2 rounded-lg text-sm truncate transition-colors',
                isActive ? 'bg-surface-2 text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-surface-2/60'
              )}
            >
              {p.name}
            </NavLink>
          ))}
        </div>

        <div className="pt-3 border-t border-border mt-3">
          {user ? (
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
              <LogOut className="size-4" /> Sign out
            </Button>
          ) : (
            <Button variant="hero" size="sm" className="w-full" onClick={() => nav('/auth')}>
              <LogIn className="size-4" /> Sign in
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
