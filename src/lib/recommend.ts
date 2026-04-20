// Hybrid recommendation engine. JS-style: plain functions over arrays.
import { TRACKS, getTrack, tracksByArtist, tracksByGenre } from '@/data/seed';

// History-based: weight tracks by genre frequency in recent history.
export function recommendFromHistory(historyTrackIds: string[], limit = 8) {
  const recent = historyTrackIds.slice(0, 50);
  const genreCount: Record<string, number> = {};
  const heard = new Set(recent);
  for (const id of recent) {
    const t = getTrack(id);
    if (!t) continue;
    genreCount[t.genre] = (genreCount[t.genre] || 0) + 1;
  }
  const candidates = TRACKS
    .filter(t => !heard.has(t.id))
    .map(t => ({ t, score: (genreCount[t.genre] || 0) * 10 + t.popularity / 10 }))
    .sort((a, b) => b.score - a.score);
  return candidates.slice(0, limit).map(c => c.t);
}

// Trending: globally popular tracks.
export function recommendTrending(limit = 8) {
  return [...TRACKS].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

// Playlist-based: for a set of track IDs, find similar by artist/genre.
export function recommendFromPlaylist(playlistTrackIds: string[], limit = 8) {
  const inPlaylist = new Set(playlistTrackIds);
  const artistScore: Record<string, number> = {};
  const genreScore: Record<string, number> = {};
  for (const id of playlistTrackIds) {
    const t = getTrack(id);
    if (!t) continue;
    artistScore[t.artistId] = (artistScore[t.artistId] || 0) + 2;
    genreScore[t.genre] = (genreScore[t.genre] || 0) + 1;
  }
  return TRACKS
    .filter(t => !inPlaylist.has(t.id))
    .map(t => ({ t, score: (artistScore[t.artistId] || 0) + (genreScore[t.genre] || 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(c => c.t);
}

// "Made for you" — blend of history + trending + a touch of playlist.
export function madeForYou(historyTrackIds: string[], playlistTrackIds: string[] = [], limit = 10) {
  const fromHist = recommendFromHistory(historyTrackIds, limit);
  const fromTrend = recommendTrending(limit);
  const fromPlay = recommendFromPlaylist(playlistTrackIds, limit);
  const seen = new Set<string>();
  const out: typeof TRACKS = [];
  // Interleave for variety, weighted toward history.
  let i = 0;
  while (out.length < limit && i < limit * 3) {
    const pools = [fromHist[i], fromHist[i + 1], fromTrend[i], fromPlay[i]];
    for (const t of pools) {
      if (t && !seen.has(t.id)) {
        seen.add(t.id);
        out.push(t);
        if (out.length >= limit) break;
      }
    }
    i++;
  }
  return out;
}
