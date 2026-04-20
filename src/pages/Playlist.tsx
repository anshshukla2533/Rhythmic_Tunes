import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FEATURED_PLAYLISTS, getTrack, TRACKS } from '@/data/seed';
import { TrackRow } from '@/components/TrackRow';
import { TrackCard } from '@/components/TrackCard';
import { PlayButton } from '@/components/PlayButton';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { recommendFromPlaylist } from '@/lib/recommend';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function Playlist() {
  const { id, kind } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [meta, setMeta] = useState<any>(null);
  const [trackIds, setTrackIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');

  // "/playlist/featured/:id" is the featured route variant
  const isFeatured = kind === 'featured';

  const refresh = async () => {
    setLoading(true);
    if (isFeatured) {
      const fp = FEATURED_PLAYLISTS.find(p => p.id === id);
      setMeta(fp ? { ...fp, isFeatured: true } : null);
      setTrackIds(fp?.trackIds ?? []);
    } else if (id) {
      const { data: pl } = await supabase.from('playlists').select('*').eq('id', id).maybeSingle();
      setMeta(pl);
      const { data: pt } = await supabase
        .from('playlist_tracks').select('track_id, position')
        .eq('playlist_id', id).order('position', { ascending: true });
      setTrackIds((pt ?? []).map((r: any) => r.track_id));
    }
    setLoading(false);
  };

  useEffect(() => { refresh(); }, [id, kind]);
  useEffect(() => { if (meta?.name) document.title = `${meta.name} — RhythmicTunes`; }, [meta?.name]);

  if (loading) return <div className="p-8 text-muted-foreground">Loading…</div>;
  if (!meta) return <div className="p-8">Playlist not found.</div>;

  const tracks = trackIds.map(getTrack).filter(Boolean) as any[];
  const recs = recommendFromPlaylist(trackIds, 6);
  const isOwner = !isFeatured && user && meta.user_id === user.id;

  const removeTrack = async (trackId: string) => {
    if (!isOwner) return;
    await supabase.from('playlist_tracks').delete().eq('playlist_id', id).eq('track_id', trackId);
    refresh();
  };

  const addTrack = async (trackId: string) => {
    if (!isOwner) return;
    await supabase.from('playlist_tracks').insert({ playlist_id: id!, track_id: trackId, position: trackIds.length });
    toast({ title: 'Added to playlist' });
    refresh();
  };

  const deletePlaylist = async () => {
    if (!isOwner) return;
    await supabase.from('playlists').delete().eq('id', id);
    nav('/library');
  };

  const filteredCatalog = q.trim()
    ? TRACKS.filter(t => t.title.toLowerCase().includes(q.toLowerCase()))
    : TRACKS.slice(0, 20);

  return (
    <div className="pb-8">
      {/* Header */}
      <header className="relative px-4 md:px-8 pt-8 pb-6 bg-gradient-to-b from-surface-2 to-transparent">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="size-44 md:size-56 rounded-2xl overflow-hidden shadow-lift">
            {meta.cover_url || meta.cover ? (
              <img src={meta.cover_url || meta.cover} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-mesh" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Playlist</div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-2">{meta.name}</h1>
            {(meta.description) && <p className="text-muted-foreground mt-3 max-w-2xl">{meta.description}</p>}
            <div className="text-sm text-muted-foreground mt-4">{tracks.length} tracks</div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <PlayButton trackIds={trackIds} size="iconLg" />
          {isOwner && (
            <>
              <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghostPill"><Plus className="size-4" /> Add tracks</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader><DialogTitle>Add tracks to "{meta.name}"</DialogTitle></DialogHeader>
                  <Input placeholder="Search the catalog…" value={q} onChange={e => setQ(e.target.value)} />
                  <div className="max-h-96 overflow-y-auto scrollbar-thin space-y-1 mt-2">
                    {filteredCatalog.map(t => (
                      <div key={t.id} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-surface-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={t.cover} className="size-10 rounded" alt="" />
                          <div className="min-w-0">
                            <div className="truncate font-medium text-sm">{t.title}</div>
                            <div className="truncate text-xs text-muted-foreground">{t.album}</div>
                          </div>
                        </div>
                        <Button size="sm" variant="ghostPill" disabled={trackIds.includes(t.id)} onClick={() => addTrack(t.id)}>
                          {trackIds.includes(t.id) ? 'Added' : 'Add'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" onClick={deletePlaylist}><Trash2 className="size-4" /> Delete</Button>
            </>
          )}
        </div>
      </header>

      {/* Tracks */}
      <section className="px-4 md:px-8 mt-2">
        <div className="glass-card rounded-2xl p-2">
          {tracks.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground">No tracks yet.</p>
          ) : (
            tracks.map((t, i) => (
              <div key={t.id} className="relative">
                <TrackRow track={t} index={i} trackIds={trackIds} />
                {isOwner && (
                  <button
                    onClick={() => removeTrack(t.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 focus:opacity-100 text-muted-foreground hover:text-destructive p-2"
                    aria-label="Remove from playlist"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recommendations */}
      {recs.length > 0 && (
        <section className="px-4 md:px-8 mt-10">
          <h2 className="font-display text-2xl font-bold mb-4">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recs.map(t => <TrackCard key={t.id} track={t} />)}
          </div>
        </section>
      )}
    </div>
  );
}
