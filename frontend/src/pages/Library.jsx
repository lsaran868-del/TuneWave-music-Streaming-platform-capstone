import React, { useState } from 'react';
import { Plus, Heart, History, Music, Library as LibraryIcon } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import PlaylistCard from '../components/PlaylistCard';

export default function Library({ setActiveTab, setSelectedPlaylistId }) {
  const { playlists, likedSongIds, songs, listeningHistory, setIsCreatePlaylistOpen } = useAudio();
  const [libraryTab, setLibraryTab] = useState('playlists'); // 'playlists' | 'history'

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="page-body animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Library Header & Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Your Music Library</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your personal playlists, saved songs, and listening log.</p>
        </div>
        <button onClick={() => setIsCreatePlaylistOpen(true)} className="btn-primary">
          <Plus size={18} />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setLibraryTab('playlists')}
          style={{
            background: 'none',
            border: 'none',
            color: libraryTab === 'playlists' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: libraryTab === 'playlists' ? '2px solid var(--primary)' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          Playlists ({playlists.length + 1})
        </button>
        <button
          onClick={() => setLibraryTab('history')}
          style={{
            background: 'none',
            border: 'none',
            color: libraryTab === 'history' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: libraryTab === 'history' ? '2px solid var(--primary)' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          Listening History ({listeningHistory.length})
        </button>
      </div>

      {libraryTab === 'playlists' && (
        <div className="cards-grid">
          {/* Liked Songs Special Card */}
          <div
            onClick={() => {
              setActiveTab('playlist-detail');
              setSelectedPlaylistId('liked-songs');
            }}
            className="glass-card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(236, 72, 153, 0.25) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              height: '240px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-sm)',
              background: '#ec4899',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(236,72,153,0.5)'
            }}>
              <Heart size={24} fill="#fff" color="#fff" />
            </div>

            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Liked Songs</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', opacity: 0.9 }}>
                {likedSongIds.size} favorite tracks saved
              </p>
            </div>
          </div>

          {/* User & Curated Playlists */}
          {playlists.map(pl => (
            <PlaylistCard
              key={pl.id}
              playlist={pl}
              onClick={() => {
                setActiveTab('playlist-detail');
                setSelectedPlaylistId(pl.id);
              }}
            />
          ))}
        </div>
      )}

      {libraryTab === 'history' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Recently Streamed History</h2>
          
          <table className="songs-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Track Info</th>
                <th>Played At</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {listeningHistory.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td style={{ fontWeight: 600 }}>{idx + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img src={item.song?.coverUrl} alt={item.song?.title} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700 }}>{item.song?.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.song?.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(item.playedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {formatTime(item.song?.duration || 180)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
