import { useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLikes } from '@/hooks/useUserData';
import { getTrack } from '@/data/seed';
import { TrackRow } from '@/components/TrackRow';
import { PlayButton } from '@/components/PlayButton';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function LikedSongs() {
  const { user, loading } = useAuth();
  const { likes } = useLikes();
  const nav = useNavigate();

  useEffect(() => { document.title = 'Liked Songs — RhythmicTunes'; }, []);

  const tracks = useMemo(() => Array.from(likes).map(getTrack).filter(Boolean) as any[], [likes]);
  const ids = tracks.map(t => t.id);

  if (loading) return null;
  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4 text-muted-foreground">Sign in to view your liked songs.</p>
        <Button variant="hero" onClick={() => nav('/auth')}>Sign in</Button>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <header className="px-4 md:px-8 pt-8 pb-6 bg-gradient-to-b from-accent/20 to-transparent">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="size-44 md:size-56 rounded-2xl bg-gradient-accent shadow-accent-glow grid place-items-center">
            <Heart className="size-20 fill-current text-accent-foreground" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Playlist</div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-2">Liked Songs</h1>
            <div className="text-sm text-muted-foreground mt-3">{tracks.length} tracks</div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6">
          {tracks.length > 0 && <PlayButton trackIds={ids} size="iconLg" />}
        </div>
      </header>

      <section className="px-4 md:px-8 mt-2">
        <div className="glass-card rounded-2xl p-2">
          {tracks.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground">No liked songs yet — tap the heart on any track.</p>
          ) : (
            tracks.map((t, i) => <TrackRow key={t.id} track={t} index={i} trackIds={ids} />)
          )}
        </div>
      </section>
    </div>
  );
}
