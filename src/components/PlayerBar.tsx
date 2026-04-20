import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart } from 'lucide-react';
import { usePlayer } from '@/hooks/usePlayer';
import { getArtist, formatDuration } from '@/data/seed';
import { useLikes } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useAuth';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function PlayerBar() {
  const { current, isPlaying, toggle, next, prev, progress, duration, seek, volume, setVolume } = usePlayer();
  const { isLiked, toggle: toggleLike } = useLikes();
  const { user } = useAuth();

  const artist = current ? getArtist(current.artistId) : null;
  const liked = current ? isLiked(current.id) : false;
  const muted = volume === 0;

  return (
    <div className="px-3 pb-3 pt-1">
      <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-4">
        {/* Now playing */}
        <div className="flex items-center gap-3 min-w-0 w-[28%]">
          {current ? (
            <>
              <img src={current.cover} alt="" className="size-14 rounded-md object-cover" />
              <div className="min-w-0">
                <div className="font-medium truncate">{current.title}</div>
                <Link to={`/artist/${artist?.id}`} className="text-xs text-muted-foreground hover:text-foreground hover:underline truncate block">
                  {artist?.name}
                </Link>
              </div>
              <button
                onClick={() => user && current && toggleLike(current.id)}
                disabled={!user}
                className="ml-1"
                aria-label={liked ? 'Unlike' : 'Like'}
              >
                <Heart className={cn('size-4', liked ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-foreground')} />
              </button>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">Pick a track to start playing</div>
          )}
        </div>

        {/* Controls + scrubber */}
        <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
          <div className="flex items-center gap-3">
            <button onClick={prev} className="text-muted-foreground hover:text-foreground" aria-label="Previous">
              <SkipBack className="size-5" />
            </button>
            <button
              onClick={toggle}
              disabled={!current}
              className="size-10 rounded-full bg-foreground text-background grid place-items-center hover:scale-105 active:scale-95 transition-transform shadow-lg disabled:opacity-50"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current ml-0.5" />}
            </button>
            <button onClick={next} className="text-muted-foreground hover:text-foreground" aria-label="Next">
              <SkipForward className="size-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 w-full max-w-xl">
            <span className="text-[11px] tabular-nums text-muted-foreground w-9 text-right">{formatDuration(progress)}</span>
            <Slider
              value={[progress]}
              max={duration || (current?.duration ?? 1)}
              step={0.1}
              onValueChange={(v) => seek(v[0])}
              className="flex-1"
            />
            <span className="text-[11px] tabular-nums text-muted-foreground w-9">{formatDuration(duration || (current?.duration ?? 0))}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center gap-2 w-[18%] justify-end">
          <button onClick={() => setVolume(muted ? 0.8 : 0)} className="text-muted-foreground hover:text-foreground" aria-label="Mute">
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <Slider value={[volume]} max={1} step={0.01} onValueChange={(v) => setVolume(v[0])} className="w-28" />
        </div>
      </div>
    </div>
  );
}
