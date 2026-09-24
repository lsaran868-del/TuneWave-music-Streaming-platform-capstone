import React from 'react';
import { Play, Pause, Heart, Plus } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function SongCard({ song, queueContext = null }) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, likedSongIds, toggleLikeSong, playlists, addSongToPlaylist } = useAudio();

  const isCurrent = currentTrack?.id === song.id;
  const isLiked = likedSongIds.has(song.id);

  return (
    <div className="glass-card" style={{
      padding: '0.85rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      position: 'relative',
      group: 'card'
    }}>
      {/* Cover Image Container */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
        <img
          src={song.coverUrl}
          alt={song.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Hover Play Action Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isCurrent ? 1 : 0,
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
        onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.opacity = 0; }}
        >
          <button
            onClick={() => {
              if (isCurrent) togglePlayPause();
              else playTrack(song, queueContext);
            }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#000',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(29,185,84,0.5)',
              transform: 'scale(1)',
              transition: 'transform 0.15s ease'
            }}
          >
            {isCurrent && isPlaying ? <Pause size={22} fill="#000" /> : <Play size={22} fill="#000" style={{ marginLeft: '2px' }} />}
          </button>
        </div>
      </div>

      {/* Song Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <div style={{
          fontWeight: 700,
          fontSize: '0.92rem',
          color: isCurrent ? 'var(--primary)' : 'var(--text-main)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {song.title}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {song.artist}
        </div>
      </div>

      {/* Footer Actions & Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
          {song.genre}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            onClick={() => toggleLikeSong(song.id)}
            className="btn-icon"
            style={{ color: isLiked ? '#ec4899' : 'var(--text-muted)' }}
          >
            <Heart size={16} fill={isLiked ? '#ec4899' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}
