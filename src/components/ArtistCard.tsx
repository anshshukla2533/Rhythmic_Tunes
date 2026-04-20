import { Link } from 'react-router-dom';

export function ArtistCard({ artist }: { artist: any }) {
  return (
    <Link to={`/artist/${artist.id}`} className="group glass-card rounded-2xl p-4 hover:shadow-lift hover:-translate-y-1 transition-all duration-300 block">
      <div className="aspect-square rounded-full overflow-hidden mb-4 ring-1 ring-border">
        <img src={artist.image} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
      </div>
      <div className="text-center">
        <div className="font-display font-semibold truncate">{artist.name}</div>
        <div className="text-xs text-muted-foreground">Artist</div>
      </div>
    </Link>
  );
}
