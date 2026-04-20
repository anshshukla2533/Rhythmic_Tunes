import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ARTISTS, GENRES, TRACKS, getArtist } from '@/data/seed';
import { TrackRow } from '@/components/TrackRow';
import { ArtistCard } from '@/components/ArtistCard';
import { Link as RLink } from 'react-router-dom';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const genre = params.get('genre');

  useEffect(() => { document.title = 'Search — RhythmicTunes'; }, []);

  const results = useMemo(() => {
    let pool = TRACKS;
    if (genre) pool = pool.filter(t => t.genre === genre);
    if (!q.trim()) return pool;
    const ql = q.toLowerCase();
    return pool.filter(t => {
      const a = getArtist(t.artistId);
      return t.title.toLowerCase().includes(ql) || (a?.name.toLowerCase().includes(ql) ?? false) || t.album.toLowerCase().includes(ql);
    });
  }, [q, genre]);

  const artistResults = useMemo(() => {
    if (!q.trim()) return ARTISTS;
    const ql = q.toLowerCase();
    return ARTISTS.filter(a => a.name.toLowerCase().includes(ql));
  }, [q]);

  const ids = results.map(t => t.id);

  return (
    <div className="px-4 md:px-8 py-6 space-y-8 pb-8">
      <div className="relative max-w-xl">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
        <Input
          autoFocus
          value={q}
          onChange={(e) => { setQ(e.target.value); setParams(prev => { prev.set('q', e.target.value); return prev; }); }}
          placeholder="Songs, artists, albums…"
          className="pl-12 h-14 text-base rounded-2xl bg-surface-1 border-border focus-visible:ring-primary"
        />
      </div>

      {/* Genre chips */}
      <div className="flex flex-wrap gap-2">
        <RLink
          to="/search"
          className={`px-4 py-1.5 rounded-full text-sm font-medium border ${!genre ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface-2 border-border text-muted-foreground hover:text-foreground'}`}
        >
          All
        </RLink>
        {GENRES.map(g => (
          <Link
            key={g.id}
            to={`/search?genre=${g.id}${q ? `&q=${q}` : ''}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border ${genre === g.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface-2 border-border text-muted-foreground hover:text-foreground'}`}
          >
            {g.name}
          </Link>
        ))}
      </div>

      {q && artistResults.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold mb-4">Artists</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {artistResults.slice(0, 6).map(a => <ArtistCard key={a.id} artist={a} />)}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-xl font-bold mb-2">
          {results.length} {results.length === 1 ? 'track' : 'tracks'}
        </h2>
        <div className="glass-card rounded-2xl p-2">
          {results.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground">No results for "{q}"</p>
          ) : (
            results.map((t, i) => <TrackRow key={t.id} track={t} index={i} trackIds={ids} />)
          )}
        </div>
      </section>
    </div>
  );
}
