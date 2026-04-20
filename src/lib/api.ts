const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'API error');
  return json;
}

export const api = {
  // Auth
  signup: (email: string, password: string, display_name?: string) =>
    apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, display_name }) }),
  signin: (email: string, password: string) =>
    apiFetch('/api/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => apiFetch('/api/auth/me'),

  // Likes
  getLikes: () => apiFetch('/api/likes'),
  toggleLike: (trackId: string) => apiFetch(`/api/likes/${trackId}`, { method: 'POST' }),

  // Follows
  getFollows: () => apiFetch('/api/follows'),
  toggleFollow: (artistId: string) => apiFetch(`/api/follows/${artistId}`, { method: 'POST' }),

  // History
  getHistory: () => apiFetch('/api/history'),
  recordPlay: (trackId: string) => apiFetch(`/api/history/${trackId}`, { method: 'POST' }),

  // Playlists
  getPlaylists: () => apiFetch('/api/playlists'),
  getPlaylist: (id: string) => apiFetch(`/api/playlists/${id}`),
  getPlaylistTracks: (id: string) => apiFetch(`/api/playlists/${id}/tracks`),
  createPlaylist: (name: string, description?: string) =>
    apiFetch('/api/playlists', { method: 'POST', body: JSON.stringify({ name, description }) }),
  addTrackToPlaylist: (playlistId: string, track_id: string, position?: number) =>
    apiFetch(`/api/playlists/${playlistId}/tracks`, { method: 'POST', body: JSON.stringify({ track_id, position }) }),
  removeTrackFromPlaylist: (playlistId: string, trackId: string) =>
    apiFetch(`/api/playlists/${playlistId}/tracks/${trackId}`, { method: 'DELETE' }),
  deletePlaylist: (id: string) => apiFetch(`/api/playlists/${id}`, { method: 'DELETE' }),
};
