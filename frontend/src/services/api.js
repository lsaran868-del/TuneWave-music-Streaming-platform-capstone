import { INITIAL_SONGS, INITIAL_PLAYLISTS } from '../data/initialSongs';

const BASE_URL = '/api';

// Helper to get JWT token from localStorage
const getAuthHeaders = () => {
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
      if (!res.ok) throw new Error('Authentication failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend API offline. Using demo auth response.');
      return {
        token: 'demo-jwt-token-tunewave-2026',
        user: { id: 'usr-1', email, username: email.split('@')[0] || 'Music Lover', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }
      };
    }
  },

  register: async (email, password, username) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
      });
      if (!res.ok) throw new Error('Registration failed');
      return await res.json();
    } catch (err) {
      return {
        token: 'demo-jwt-token-tunewave-2026',
        user: { id: `usr-${Date.now()}`, email, username, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }
      };
    }
  },

  // Songs Catalog
  getSongs: async () => {
    try {
      const res = await fetch(`${BASE_URL}/songs`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error();
      return await res.json();
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

  logPlayEvent: async (songId, durationSeconds) => {
    try {
      await fetch(`${BASE_URL}/history`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ songId, playDurationSeconds: durationSeconds })
      });
    } catch (err) {
      // Logged locally in AudioContext
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
      return null; // Fallback to client JS engine in AudioContext/AIDiscovery page
    }
  }
};
