// Convenience hooks: liked tracks, followed artists, listening history, playlists.
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './useAuth';

export function useLikes() {
  const { user } = useAuth();
  const [likes, setLikes] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    if (!user) return setLikes(new Set());
    try {
      const trackIds: string[] = await api.getLikes();
      setLikes(new Set(trackIds));
    } catch { setLikes(new Set()); }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const toggle = async (trackId: string) => {
    if (!user) return false;
    const has = likes.has(trackId);
    // Optimistic update
    setLikes(s => {
      const n = new Set(s);
      has ? n.delete(trackId) : n.add(trackId);
      return n;
    });
    try {
      await api.toggleLike(trackId);
    } catch {
      // Revert on error
      setLikes(s => {
        const n = new Set(s);
        has ? n.add(trackId) : n.delete(trackId);
        return n;
      });
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
    try {
      const artistIds: string[] = await api.getFollows();
      setFollows(new Set(artistIds));
    } catch { setFollows(new Set()); }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const toggle = async (artistId: string) => {
    if (!user) return false;
    const has = follows.has(artistId);
    setFollows(s => {
      const n = new Set(s);
      has ? n.delete(artistId) : n.add(artistId);
      return n;
    });
    try {
      await api.toggleFollow(artistId);
    } catch {
      setFollows(s => {
        const n = new Set(s);
        has ? n.add(artistId) : n.delete(artistId);
        return n;
      });
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
    try {
      const trackIds: string[] = await api.getHistory();
      setHistory(trackIds);
    } catch { setHistory([]); }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  return { history, refresh };
}

export function usePlaylists() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<any[]>([]);

  const refresh = useCallback(async () => {
    if (!user) return setPlaylists([]);
    try {
      const data = await api.getPlaylists();
      setPlaylists(data);
    } catch { setPlaylists([]); }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (name: string, description?: string) => {
    if (!user) return null;
    const data = await api.createPlaylist(name, description);
    await refresh();
    return data;
  };

  const remove = async (id: string) => {
    await api.deletePlaylist(id);
    await refresh();
  };

  return { playlists, refresh, create, remove };
}
