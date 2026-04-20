// Seed catalog for RhythmicTunes — royalty-free samples from Pixabay CDN.
// JS-style: minimal types, plain objects.

export const GENRES = [
  { id: 'electronic', name: 'Electronic', color: 'from-fuchsia-500 to-purple-600' },
  { id: 'ambient',    name: 'Ambient',    color: 'from-cyan-500 to-sky-700' },
  { id: 'cinematic',  name: 'Cinematic',  color: 'from-amber-500 to-rose-600' },
  { id: 'lofi',       name: 'Lo-Fi',      color: 'from-emerald-500 to-teal-700' },
  { id: 'rock',       name: 'Rock',       color: 'from-red-500 to-orange-600' },
  { id: 'acoustic',   name: 'Acoustic',   color: 'from-yellow-500 to-amber-700' },
];

export const ARTISTS = [
  { id: 'a-lumen',     name: 'Lumen',          bio: 'Synth architect crafting glowing nightscapes.',         followers: 482103, image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80' },
  { id: 'a-vela',      name: 'Vela',           bio: 'Ambient explorer of cinematic spaces.',                 followers: 213409, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80' },
  { id: 'a-novalis',   name: 'Novalis',        bio: 'Orchestral storyteller for the modern era.',            followers: 154728, image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80' },
  { id: 'a-hush',      name: 'Hush Collective',bio: 'Lo-fi beats from a basement somewhere warm.',           followers: 891004, image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&q=80' },
  { id: 'a-emberline', name: 'Emberline',      bio: 'Indie rock with a heart-on-sleeve.',                    followers: 327811, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80' },
  { id: 'a-fern',      name: 'Fern',           bio: 'Acoustic confessions and folk lullabies.',              followers: 98213,  image: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&q=80' },
  { id: 'a-orion',     name: 'Orion',          bio: 'Future-bass and dancefloor catharsis.',                 followers: 612300, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80' },
  { id: 'a-mira',      name: 'Mira',           bio: 'Vocalist and songwriter. Soft power.',                  followers: 459220, image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80' },
];

// Track URLs from Pixabay CDN — royalty free, hot-linkable.
const T = (id: string, t: string, a: string, g: string, dur: number, url: string, cover: string, pop: number) => ({
  id, title: t, artistId: a, genre: g, duration: dur, fileUrl: url, cover, popularity: pop,
  album: t.split(' ')[0],
});

export const TRACKS = [
  // Electronic / Orion / Lumen
  T('t1','Neon Pulse','a-lumen','electronic',132,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3','https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=600&q=80', 95),
  T('t2','Midnight Drive','a-orion','electronic',147,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3','https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80', 88),
  T('t3','Aurora','a-lumen','electronic',184,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3','https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600&q=80', 80),
  T('t4','Velocity','a-orion','electronic',155,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3','https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80', 72),

  
  T('t5','Floating','a-vela','ambient',201,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3','https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80', 65),
  T('t6','Glass Sea','a-vela','ambient',228,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3','https://images.unsplash.com/photo-1515895250413-cc9762d7b65f?w=600&q=80', 58),
  T('t7','Soft Snow','a-lumen','ambient',176,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3','https://images.unsplash.com/photo-1483401757487-2ced3fa77952?w=600&q=80', 52),

  
  T('t8','First Light','a-novalis','cinematic',195,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80', 90),
  T('t9','The Ascent','a-novalis','cinematic',221,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3','https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', 76),
  T('t10','Last Horizon','a-novalis','cinematic',208,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3','https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80', 70),

  
  T('t11','Window Seat','a-hush','lofi',164,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3','https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600&q=80', 92),
  T('t12','Late Bus','a-hush','lofi',151,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3','https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80', 84),
  T('t13','Coffee at 3','a-hush','lofi',173,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3','https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80', 78),
  T('t14','Tape Hiss','a-hush','lofi',158,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3','https://images.unsplash.com/photo-1485579149621-3123dd979885?w=600&q=80', 67),

  
  T('t15','Run It Loud','a-emberline','rock',192,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3','https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=600&q=80', 86),
  T('t16','Cardinal','a-emberline','rock',207,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3','https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80', 74),
  T('t17','Hold the Line','a-emberline','rock',218,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3','https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80', 60),

  T('t18','Paper Boats','a-fern','acoustic',174,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3','https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=600&q=80', 71),
  T('t19','Slow Light','a-fern','acoustic',186,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3','https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80', 64),
  T('t20','Little Wonder','a-mira','acoustic',162,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3','https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80', 81),
  T('t21','Open Window','a-mira','acoustic',171,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3','https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&q=80', 68),

  
  T('t22','Stardust','a-mira','electronic',169,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3','https://images.unsplash.com/photo-1462393582658-f5b56a86adb6?w=600&q=80', 89),
  T('t23','Echoes','a-vela','cinematic',233,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3','https://images.unsplash.com/photo-1499415479124-43c32433a620?w=600&q=80', 55),
  T('t24','Silver Path','a-novalis','ambient',217,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3','https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80', 50),
];

export const FEATURED_PLAYLISTS = [
  { id: 'fp1', name: 'Late Night Drive',  description: 'Neon-soaked synths for empty highways.', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80', trackIds: ['t2','t1','t22','t4','t3'] },
  { id: 'fp2', name: 'Deep Focus',        description: 'Soft textures for deep work.',          cover: 'https://images.unsplash.com/photo-1483401757487-2ced3fa77952?w=600&q=80', trackIds: ['t5','t7','t6','t24','t11'] },
  { id: 'fp3', name: 'Indie Anthems',     description: 'Hooks that stay with you.',             cover: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=600&q=80', trackIds: ['t15','t16','t17','t18'] },
  { id: 'fp4', name: 'Sunday Acoustic',   description: 'Sunlit songs for slow mornings.',        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80', trackIds: ['t19','t18','t20','t21'] },
  { id: 'fp5', name: 'Cinematic Skies',   description: 'Score for your own movie.',             cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80', trackIds: ['t8','t9','t10','t23'] },
];


export const getTrack = (id: string) => TRACKS.find(t => t.id === id);
export const getArtist = (id: string) => ARTISTS.find(a => a.id === id);
export const getGenre = (id: string) => GENRES.find(g => g.id === id);
export const tracksByArtist = (artistId: string) => TRACKS.filter(t => t.artistId === artistId);
export const tracksByGenre = (genreId: string) => TRACKS.filter(t => t.genre === genreId);

export const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};
