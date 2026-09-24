import { INITIAL_SONGS, INITIAL_PLAYLISTS } from '../data/initialSongs';

// Base API URL configured via environment variable (VITE_API_BASE_URL)
const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

// Helper to get JWT token from localStorage with Bearer header
export const getAuthHeaders = () => {
  const token = localStorage.getItem('tunewave_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Authentication
  login: async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const errorMessage = data?.message || data?.error || `Authentication failed (HTTP ${res.status})`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (err) {
      if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
        throw new Error('TuneWave backend server is offline or unreachable. Please verify server is running on ' + BASE_URL);
      }
      throw err;
    }
  },

  register: async (email, password, username) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const errorMessage = data?.message || data?.error || `Registration failed (HTTP ${res.status})`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (err) {
      if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
        throw new Error('TuneWave backend server is offline or unreachable. Please verify server is running on ' + BASE_URL);
      }
      throw err;
    }
  },

  getMe: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      const errorMessage = data?.message || data?.error || `Failed to fetch authenticated user (HTTP ${res.status})`;
      throw new Error(errorMessage);
    }

    return await res.json();
  },

  checkHealth: async () => {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Songs Catalog & Search API
  getSongs: async () => {
    try {
      const res = await fetch(`${BASE_URL}/songs`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : INITIAL_SONGS;
    } catch {
      return INITIAL_SONGS;
    }
  },

  getSongById: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/songs/${id}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return INITIAL_SONGS.find(s => s.id === id) || INITIAL_SONGS[0];
    }
  },

  searchSongs: async (query) => {
    try {
      const q = encodeURIComponent(query || '');
      const res = await fetch(`${BASE_URL}/songs/search?q=${q}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      // Offline fallback: filter INITIAL_SONGS
      const lower = (query || '').toLowerCase();
      return INITIAL_SONGS.filter(s =>
        s.title.toLowerCase().includes(lower) ||
        s.artist.toLowerCase().includes(lower) ||
        (s.album && s.album.toLowerCase().includes(lower)) ||
        s.genre.toLowerCase().includes(lower)
      );
    }
  },

  getSongsByGenre: async (genre) => {
    try {
      const g = encodeURIComponent(genre || '');
      const res = await fetch(`${BASE_URL}/songs/genre/${g}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return INITIAL_SONGS.filter(s => s.genre.toLowerCase() === (genre || '').toLowerCase());
    }
  },

  getTrendingSongs: async () => {
    try {
      const res = await fetch(`${BASE_URL}/songs/trending`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return [...INITIAL_SONGS].sort((a, b) => (b.streamCount || 0) - (a.streamCount || 0)).slice(0, 5);
    }
  },

  getRecentlyAddedSongs: async () => {
    try {
      const res = await fetch(`${BASE_URL}/songs/recently-added`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return INITIAL_SONGS.slice(0, 6);
    }
  },

  incrementStream: async (songId) => {
    try {
      const res = await fetch(`${BASE_URL}/songs/${songId}/stream`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch {
      // non-critical
    }
    return null;
  },

  logPlayEvent: async (songId, durationSeconds) => {
    try {
      await fetch(`${BASE_URL}/history`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ songId, playDurationSeconds: durationSeconds })
      });
    } catch (err) {
      // Handled locally
    }
  },

  // Playlists
  getPlaylists: async () => {
    try {
      const res = await fetch(`${BASE_URL}/playlists`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return INITIAL_PLAYLISTS;
    }
  },

  createPlaylist: async (playlistData) => {
    try {
      const res = await fetch(`${BASE_URL}/playlists`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(playlistData)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return {
        id: `pl-${Date.now()}`,
        ...playlistData,
        songIds: playlistData.songIds || [],
        createdBy: 'You',
        createdAt: new Date().toISOString().split('T')[0]
      };
    }
  },

  // AI Recommendations Endpoint
  getAIRecommendations: async (prompt, targetFeatures) => {
    try {
      const res = await fetch(`${BASE_URL}/recommendations/ai-playlist`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ prompt, targetFeatures })
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return null;
    }
  }
};
