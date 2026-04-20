import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useLikes, usePlaylists, useFollows } from '@/hooks/useUserData';
import { TrackRow } from '@/components/TrackRow';
import { ArtistCard } from '@/components/ArtistCard';
import { getTrack, getArtist } from '@/data/seed';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

export default function Library() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { likes } = useLikes();
  const { playlists, create } = usePlaylists();
  const { follows } = useFollows();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => { document.title = 'Your Library — RhythmicTunes'; }, []);

  if (loading) return null;

  if (!user) {
    return (
      <div className="px-4 md:px-8 py-20 max-w-xl mx-auto text-center">
        <h1 className="font-display text-3xl font-bold mb-3">Your Library awaits</h1>
        <p className="text-muted-foreground mb-6">Sign in to save liked songs, follow artists, and create playlists.</p>
        <Button variant="hero" size="lg" onClick={() => nav('/auth')}>Sign in</Button>
      </div>
    );
  }

  const likedTracks = Array.from(likes).map(getTrack).filter(Boolean) as any[];
  const followedArtists = Array.from(follows).map(getArtist).filter(Boolean) as any[];

  return (
    <div className="px-4 md:px-8 py-6 space-y-10 pb-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Your Library</h1>
          <p className="text-muted-foreground mt-1">Everything you love in one place.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero"><Plus className="size-4" /> New playlist</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New playlist</DialogTitle></DialogHeader>
            <Input placeholder="Playlist name" value={name} onChange={e => setName(e.target.value)} />
            <DialogFooter>
              <Button
                variant="hero"
                onClick={async () => { const p = await create(name.trim()); setOpen(false); setName(''); if (p?.id) nav(`/playlist/${p.id}`); }}
              >Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {/* Liked songs */}
      <section>
        <Link to="/library/liked" className="flex items-center gap-4 glass-card rounded-2xl p-5 hover:shadow-lift transition-shadow">
          <div className="size-20 rounded-xl bg-gradient-accent grid place-items-center shadow-accent-glow">
            <Heart className="size-9 fill-current text-accent-foreground" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Playlist</div>
            <div className="font-display text-2xl font-bold">Liked Songs</div>
            <div className="text-sm text-muted-foreground">{likedTracks.length} tracks</div>
          </div>
        </Link>
      </section>

      {/* Playlists */}
      <section>
        <h2 className="font-display text-xl font-bold mb-4">Your playlists</h2>
        {playlists.length === 0 ? (
          <p className="text-muted-foreground">No playlists yet — create one above.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {playlists.map((p: any) => (
              <Link key={p.id} to={`/playlist/${p.id}`} className="glass-card rounded-2xl p-4 hover:shadow-lift hover:-translate-y-1 transition-all">
                <div className="aspect-square rounded-xl bg-gradient-mesh mb-4" />
                <div className="font-display font-semibold truncate">{p.name}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">{p.description || 'Your playlist'}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Liked tracks list */}
      {likedTracks.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold mb-4">Recently liked</h2>
          <div className="glass-card rounded-2xl p-2">
            {likedTracks.slice(0, 10).map((t, i) => (
              <TrackRow key={t.id} track={t} index={i} trackIds={likedTracks.map(x => x.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Followed artists */}
      {followedArtists.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold mb-4">Following</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {followedArtists.map(a => <ArtistCard key={a.id} artist={a} />)}
          </div>
        </section>
      )}
    </div>
  );
}
