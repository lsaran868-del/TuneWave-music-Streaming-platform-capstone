 import React from 'react';
import { Play, Music } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function PlaylistCard({ playlist, onClick }) {
  const { songs, playTrack } = useAudio();

  const playlistSongs = songs.filter(s => playlist.songIds?.includes(s.id));

  const handlePlayAll = (e) => {
    e.stopPropagation();
    if (playlistSongs.length > 0) {
      playTrack(playlistSongs[0], playlistSongs);
    }
  };

  return (
    <div
      onClick={onClick}
      className="glass-card"
      style={{
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
        <img
          src={playlist.coverUrl}
          alt={playlist.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
        >
          <button
            onClick={handlePlayAll}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#000',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(29,185,84,0.5)'
            }}
          >
            <Play size={20} fill="#000" style={{ marginLeft: '2px' }} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {playlist.title}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {playlist.description}
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
        {playlist.songIds?.length || 0} tracks • By {playlist.createdBy}
      </div>
    </div>
  );
}
