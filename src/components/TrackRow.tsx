import { Link } from 'react-router-dom';
import { Heart, MoreHorizontal, Play } from 'lucide-react';
import { getArtist, formatDuration } from '@/data/seed';
import { usePlayer } from '@/hooks/usePlayer';
import { useLikes } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

type Props = {
  track: any;
  index?: number;
  trackIds: string[];   // queue context for play
  showAlbum?: boolean;
};

export function TrackRow({ track, index, trackIds, showAlbum = true }: Props) {
  const artist = getArtist(track.artistId);
  const { current, isPlaying, toggle, playAlbumLike } = usePlayer();
  const { isLiked, toggle: toggleLike } = useLikes();
  const { user } = useAuth();
  const isCurrent = current?.id === track.id;
  const liked = isLiked(track.id);

  const onPlay = () => {
    if (isCurrent) toggle();
    else playAlbumLike(trackIds, track.id);
  };

  return (
    <div
      onDoubleClick={onPlay}
      className={cn(
        'group grid grid-cols-[36px_1fr_auto] md:grid-cols-[36px_4fr_3fr_auto_60px] items-center gap-4 px-4 py-2 rounded-xl hover:bg-surface-2/70 transition-colors cursor-default',
        isCurrent && 'bg-surface-2/50'
      )}
    >
      {/* Index / play */}
      <div className="flex items-center justify-center w-9 h-9">
        <span className={cn('text-sm tabular-nums text-muted-foreground group-hover:hidden', isCurrent && 'hidden')}>
          {(index ?? 0) + 1}
        </span>
        {isCurrent && isPlaying ? (
          <div className="hidden group-hover:flex items-end gap-[2px] h-4">
            <span className="eq-bar w-[3px] bg-primary h-full" />
            <span className="eq-bar w-[3px] bg-primary h-full" />
            <span className="eq-bar w-[3px] bg-primary h-full" />
          </div>
        ) : null}
        <button onClick={onPlay} className="hidden group-hover:flex text-foreground" aria-label="Play track">
          <Play className="size-4 fill-current ml-0.5" />
        </button>
      </div>

      {/* Title + artist */}
      <div className="flex items-center gap-3 min-w-0">
        <img src={track.cover} alt="" className="size-11 rounded-md object-cover" loading="lazy" />
        <div className="min-w-0">
          <div className={cn('truncate font-medium', isCurrent && 'text-primary')}>{track.title}</div>
          <Link to={`/artist/${artist?.id}`} className="text-sm text-muted-foreground hover:text-foreground hover:underline truncate block">
            {artist?.name}
          </Link>
        </div>
      </div>

      {/* Album */}
      {showAlbum && (
        <div className="hidden md:block text-sm text-muted-foreground truncate">{track.album}</div>
      )}

      {/* Like */}
      <button
        onClick={() => user && toggleLike(track.id)}
        className={cn('opacity-0 group-hover:opacity-100 transition-opacity', liked && 'opacity-100')}
        aria-label={liked ? 'Unlike' : 'Like'}
        disabled={!user}
        title={user ? '' : 'Sign in to like'}
      >
        <Heart className={cn('size-4', liked ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-foreground')} />
      </button>

      {/* Duration */}
      <div className="hidden md:block text-sm text-muted-foreground tabular-nums text-right">
        {formatDuration(track.duration)}
      </div>
    </div>
  );
}
