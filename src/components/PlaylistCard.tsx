import { Link } from 'react-router-dom';
import { PlayButton } from './PlayButton';

export function PlaylistCard({ playlist }: { playlist: any }) {
  const trackIds = playlist.trackIds ?? [];
  return (
    <div className="group relative glass-card rounded-2xl p-4 hover:shadow-lift hover:-translate-y-1 transition-all duration-300">
      <Link to={`/playlist/featured/${playlist.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl mb-4">
          <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        </div>
        <div className="font-display font-semibold truncate">{playlist.name}</div>
        <div className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5em]">{playlist.description}</div>
      </Link>
      <div className="absolute bottom-20 right-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
        <PlayButton trackIds={trackIds} size="iconLg" />
      </div>
    </div>
  );
}
