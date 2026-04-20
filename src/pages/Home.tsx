import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrackCard } from '@/components/TrackCard';
import { ArtistCard } from '@/components/ArtistCard';
import { PlaylistCard } from '@/components/PlaylistCard';
import { ARTISTS, FEATURED_PLAYLISTS, GENRES, TRACKS, tracksByGenre } from '@/data/seed';
import { madeForYou, recommendTrending } from '@/lib/recommend';
import { useHistory } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { PlayButton } from '@/components/PlayButton';
import { Sparkles, TrendingUp } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const { history, refresh } = useHistory();

  useEffect(() => { document.title = 'RhythmicTunes — Discover music made for you'; }, []);
  useEffect(() => { refresh(); }, [refresh, user?.id]);

  const trending = useMemo(() => recommendTrending(8), []);
  const forYou = useMemo(() => madeForYou(history, [], 8), [history]);
  const heroTrack = trending[0];

  return (
    <div className="px-4 md:px-8 py-6 space-y-12 pb-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl glass-card p-8 md:p-12 animate-fade-in">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30 animate-spin-slow" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-transparent" aria-hidden />
        <div className="relative grid md:grid-cols-[1.3fr_1fr] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
              <Sparkles className="size-4" /> Your melodic companion
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
              Discover music
              <br />
              <span className="text-gradient-primary">made for you.</span>
            </h1>
            <p className="mt-5 text-muted-foreground max-w-lg text-lg">
              RhythmicTunes blends your listening history, trending tracks, and the patterns in
              your playlists into one personalised stream.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {heroTrack && (
                <PlayButton trackIds={trending.map(t => t.id)} variant="hero" size="lg" label="Play trending" />
              )}
              {!user && (
                <Button asChild variant="ghostPill" size="lg">
                  <Link to="/auth">Sign in to personalise</Link>
                </Button>
              )}
            </div>
          </div>
          {heroTrack && (
            <div className="relative justify-self-end">
              <div className="absolute -inset-6 bg-gradient-primary/30 blur-3xl rounded-full" aria-hidden />
              <img src={heroTrack.cover} alt="" className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl object-cover shadow-lift rotate-3 hover:rotate-0 transition-transform duration-500" />
            </div>
          )}
        </div>
      </section>

      {/* Made for you */}
      <Section title={user ? 'Made for you' : 'Recommended starters'} subtitle="Personalised picks based on what you listen to.">
        <Grid>
          {forYou.map(t => <TrackCard key={t.id} track={t} />)}
        </Grid>
      </Section>

      {/* Trending */}
      <Section title="Trending now" icon={<TrendingUp className="size-5 text-primary" />} subtitle="What everyone is playing this week.">
        <Grid>
          {trending.map(t => <TrackCard key={t.id} track={t} />)}
        </Grid>
      </Section>

      {/* Featured playlists */}
      <Section title="Featured playlists" subtitle="Curated moods and moments.">
        <Grid>
          {FEATURED_PLAYLISTS.map(p => <PlaylistCard key={p.id} playlist={p} />)}
        </Grid>
      </Section>

      {/* Genres */}
      <Section title="Browse genres">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {GENRES.map(g => (
            <Link
              key={g.id}
              to={`/search?genre=${g.id}`}
              className={`relative h-32 rounded-2xl overflow-hidden p-4 bg-gradient-to-br ${g.color} hover:scale-[1.03] transition-transform`}
            >
              <div className="font-display text-xl font-bold text-white drop-shadow">{g.name}</div>
              <div className="absolute bottom-2 right-2 text-xs text-white/70">{tracksByGenre(g.id).length} tracks</div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Artists */}
      <Section title="Popular artists">
        <Grid cols="cols-2 md:grid-cols-3 lg:grid-cols-6">
          {ARTISTS.slice(0, 6).map(a => <ArtistCard key={a.id} artist={a} />)}
        </Grid>
      </Section>
    </div>
  );
}

function Section({ title, subtitle, icon, children }: any) {
  return (
    <section className="animate-fade-in">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2">
            {icon}{title}
          </h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Grid({ children, cols = 'cols-2 md:grid-cols-3 lg:grid-cols-4' }: any) {
  return <div className={`grid grid-${cols} gap-4`}>{children}</div>;
}
