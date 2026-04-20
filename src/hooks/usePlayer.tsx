import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { TRACKS, getTrack } from '@/data/seed';
import { useAuth } from './useAuth';

const PlayerCtx = createContext<any>(null);

export function PlayerProvider({ children }: { children: any }) {
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<string[]>([]); // track ids
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const currentId = queue[index];
  const current = currentId ? getTrack(currentId) : null;

  // Init audio element once
  useEffect(() => {
    const a = new Audio();
    a.preload = 'metadata';
    audioRef.current = a;
    const onTime = () => setProgress(a.currentTime);
    const onMeta = () => setDuration(a.duration || 0);
    const onEnd = () => next();
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('ended', onEnd);
    return () => {
      a.pause();
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('ended', onEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load track when current changes
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !current) return;
    a.src = current.fileUrl;
    a.volume = volume;
    if (isPlaying) a.play().catch(() => setIsPlaying(false));
    // Log history
    if (user) {
      api.recordPlay(current.id).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  const playTracks = (ids: string[], startIdx = 0) => {
    if (!ids.length) return;
    setQueue(ids);
    setIndex(startIdx);
    setIsPlaying(true);
    // Force load new src even if same id
    setTimeout(() => audioRef.current?.play().catch(() => setIsPlaying(false)), 50);
  };

  const playTrack = (id: string) => playTracks([id], 0);

  const playAlbumLike = (ids: string[], firstId?: string) => {
    const start = firstId ? Math.max(0, ids.indexOf(firstId)) : 0;
    playTracks(ids, start);
  };

  const toggle = () => {
    const a = audioRef.current; if (!a || !current) return;
    if (isPlaying) { a.pause(); setIsPlaying(false); }
    else { a.play().then(() => setIsPlaying(true)).catch(() => {}); }
  };

  const next = () => {
    if (!queue.length) return;
    const ni = (index + 1) % queue.length;
    setIndex(ni);
    setIsPlaying(true);
  };

  const prev = () => {
    const a = audioRef.current; if (!a) return;
    if (a.currentTime > 3 || queue.length < 2) { a.currentTime = 0; return; }
    setIndex((index - 1 + queue.length) % queue.length);
    setIsPlaying(true);
  };

  const seek = (t: number) => {
    const a = audioRef.current; if (!a) return;
    a.currentTime = t; setProgress(t);
  };

  const enqueue = (id: string) => setQueue(q => [...q, id]);

  const value = {
    queue, index, current, isPlaying, progress, duration, volume,
    playTrack, playTracks, playAlbumLike, toggle, next, prev, seek, setVolume, enqueue,
  };

  return <PlayerCtx.Provider value={value}>{children}</PlayerCtx.Provider>;
}

export const usePlayer = () => {
  const ctx = useContext(PlayerCtx);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};

export const ALL_TRACK_IDS = TRACKS.map(t => t.id);
