import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getArtist, tracksByArtist } from '@/data/seed';
import { TrackRow } from '@/components/TrackRow';
import { PlayButton } from '@/components/PlayButton';
import { Button } from '@/components/ui/button';
import { useFollows } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useAuth';
import { Check, UserPlus } from 'lucide-react';

export default function Artist() {
  const { id } = useParams();
  const artist = id ? getArtist(id) : null;
  const tracks = artist ? tracksByArtist(artist.id) : [];
  const ids = tracks.map(t => t.id);
  const { user } = useAuth();
  const { isFollowing, toggle } = useFollows();
  const following = artist ? isFollowing(artist.id) : false;

  useEffect(() => { if (artist) document.title = `${artist.name} — RhythmicTunes`; }, [artist?.id]);

  if (!artist) return <div className="p-8">Artist not found.</div>;

  return (
    <div className="pb-8">
      <header className="relative h-72 md:h-96 overflow-hidden">
        <img src={artist.image} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute inset-0 flex items-end px-4 md:px-8 pb-8">
          <div className="flex items-end gap-6">
            <img src={artist.image} alt={artist.name} className="size-32 md:size-44 rounded-full object-cover ring-2 ring-border shadow-lift" />
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Artist</div>
              <h1 className="font-display text-4xl md:text-6xl font-bold mt-1">{artist.name}</h1>
              <p className="text-muted-foreground mt-2 max-w-xl">{artist.bio}</p>
              <div className="text-sm text-muted-foreground mt-2">{artist.followers.toLocaleString()} followers</div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 md:px-8 mt-2 flex items-center gap-3">
        <PlayButton trackIds={ids} size="iconLg" />
        {user && (
          <Button variant={following ? 'ghostPill' : 'hero'} onClick={() => toggle(artist.id)}>
            {following ? <><Check className="size-4" /> Following</> : <><UserPlus className="size-4" /> Follow</>}
          </Button>
        )}
      </div>

      <section className="px-4 md:px-8 mt-8">
        <h2 className="font-display text-2xl font-bold mb-4">Top tracks</h2>
        <div className="glass-card rounded-2xl p-2">
          {tracks.map((t, i) => <TrackRow key={t.id} track={t} index={i} trackIds={ids} />)}
        </div>
      </section>
    </div>
  );
}
