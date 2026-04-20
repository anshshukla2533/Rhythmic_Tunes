import { Link } from 'react-router-dom';
import { getArtist } from '@/data/seed';
import { PlayButton } from './PlayButton';

export function TrackCard({ track }: { track: any }) {
  const artist = getArtist(track.artistId);
  return (
    <div className="group relative glass-card rounded-2xl p-4 hover:shadow-lift hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden rounded-xl mb-4">
        <img src={track.cover} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60" />
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
          <PlayButton trackIds={[track.id]} size="iconLg" />
        </div>
      </div>
      <div className="min-w-0">
        <div className="font-display font-semibold truncate text-base">{track.title}</div>
        <Link to={`/artist/${artist?.id}`} className="text-sm text-muted-foreground hover:text-foreground hover:underline truncate block">
          {artist?.name}
        </Link>
      </div>
    </div>
  );
}
