import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/hooks/usePlayer';
import { cn } from '@/lib/utils';

type Props = {
  trackIds: string[];
  startId?: string;
  className?: string;
  size?: 'default' | 'lg' | 'iconLg' | 'icon' | 'iconSm';
  variant?: 'hero' | 'default' | 'ghostPill';
  label?: string;
};

export function PlayButton({ trackIds, startId, className, size = 'iconLg', variant = 'hero', label }: Props) {
  const { current, isPlaying, toggle, playAlbumLike } = usePlayer();
  const playingThis = !!current && trackIds.includes(current.id) && (!startId || current.id === startId) && isPlaying;

  const handle = (e: any) => {
    e.stopPropagation();
    if (current && trackIds.includes(current.id)) {
      toggle();
    } else {
      playAlbumLike(trackIds, startId);
    }
  };

  return (
    <Button
      onClick={handle}
      size={size}
      variant={variant}
      className={cn('rounded-full', className)}
      aria-label={playingThis ? 'Pause' : 'Play'}
    >
      {playingThis ? <Pause className="!size-6 fill-current" /> : <Play className="!size-6 fill-current ml-0.5" />}
      {label && <span className="ml-2">{label}</span>}
    </Button>
  );
}
