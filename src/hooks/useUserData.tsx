// Convenience hooks: liked tracks, followed artists, listening history, playlists.
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useLikes() {
  const { user } = useAuth();
  const [likes, setLikes] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    if (!user) return setLikes(new Set());
    const { data } = await supabase.from('liked_tracks').select('track_id').eq('user_id', user.id);
    setLikes(new Set((data ?? []).map((r: any) => r.track_id)));
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const toggle = async (trackId: string) => {
    if (!user) return false;
    const has = likes.has(trackId);
    if (has) {
      await supabase.from('liked_tracks').delete().eq('user_id', user.id).eq('track_id', trackId);
      setLikes(s => { const n = new Set(s); n.delete(trackId); return n; });
    } else {
      await supabase.from('liked_tracks').insert({ user_id: user.id, track_id: trackId });
      setLikes(s => new Set(s).add(trackId));
    }
    return !has;
  };

  return { likes, toggle, refresh, isLiked: (id: string) => likes.has(id) };
}

export function useFollows() {
  const { user } = useAuth();
  const [follows, setFollows] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    if (!user) return setFollows(new Set());
    const { data } = await supabase.from('followed_artists').select('artist_id').eq('user_id', user.id);
    setFollows(new Set((data ?? []).map((r: any) => r.artist_id)));
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const toggle = async (artistId: string) => {
    if (!user) return false;
    const has = follows.has(artistId);
    if (has) {
      await supabase.from('followed_artists').delete().eq('user_id', user.id).eq('artist_id', artistId);
      setFollows(s => { const n = new Set(s); n.delete(artistId); return n; });
    } else {
      await supabase.from('followed_artists').insert({ user_id: user.id, artist_id: artistId });
      setFollows(s => new Set(s).add(artistId));
    }
    return !has;
  };

  return { follows, toggle, isFollowing: (id: string) => follows.has(id) };
}

export function useHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<string[]>([]);
  const refresh = useCallback(async () => {
    if (!user) return setHistory([]);
    const { data } = await supabase
      .from('listening_history').select('track_id, played_at')
      .eq('user_id', user.id).order('played_at', { ascending: false }).limit(100);
    setHistory((data ?? []).map((r: any) => r.track_id));
  }, [user]);
  useEffect(() => { refresh(); }, [refresh]);
  return { history, refresh };
}

export function usePlaylists() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const refresh = useCallback(async () => {
    if (!user) return setPlaylists([]);
    const { data } = await supabase.from('playlists').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setPlaylists(data ?? []);
  }, [user]);
  useEffect(() => { refresh(); }, [refresh]);

  const create = async (name: string, description?: string) => {
    if (!user) return null;
    const { data, error } = await supabase.from('playlists').insert({ user_id: user.id, name, description }).select().single();
    if (!error) await refresh();
    return data;
  };

  const remove = async (id: string) => {
    await supabase.from('playlists').delete().eq('id', id);
    await refresh();
  };

  return { playlists, refresh, create, remove };
}
