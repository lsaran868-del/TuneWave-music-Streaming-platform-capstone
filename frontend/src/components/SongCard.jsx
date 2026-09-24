import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart, ListPlus, Check, MoreVertical, PlayCircle } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function SongCard({ song, queueContext = null }) {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    likedSongIds,
    toggleLikeSong,
    addToQueue,
    playNextInQueue
  } = useAudio();

  const [menuOpen, setMenuOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const menuRef = useRef(null);

  const isCurrent = currentTrack?.id === song.id;
  const isLiked = likedSongIds.has(song.id);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleAddToQueue = (e) => {
    e.stopPropagation();
    addToQueue(song);
    setJustAdded(true);
    setMenuOpen(false);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handlePlayNext = (e) => {
    e.stopPropagation();
    playNextInQueue(song);
    setJustAdded(true);
    setMenuOpen(false);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="glass-card" style={{
      padding: '0.85rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      position: 'relative'
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
          background: 'rgba(0, 0, 0, 0.45)',
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
            title={isCurrent && isPlaying ? "Pause" : "Play"}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {song.isExplicit && (
            <span style={{ fontSize: '0.62rem', background: 'rgba(255,255,255,0.2)', padding: '0 3px', borderRadius: '2px', fontWeight: 800, color: '#fff' }}>E</span>
          )}
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {song.artist}
          </div>
        </div>
      </div>

      {/* Footer Actions & Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', position: 'relative' }}>
        <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
          {song.genre}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }} ref={menuRef}>
          {/* Quick Add To Queue */}
          <button
            onClick={handleAddToQueue}
            className="btn-icon"
            title={justAdded ? "Added to queue!" : "Add to queue"}
            style={{
              color: justAdded ? 'var(--primary)' : 'var(--text-muted)',
              padding: '4px'
            }}
          >
            {justAdded ? <Check size={16} /> : <ListPlus size={16} />}
          </button>

          {/* Like Button */}
          <button
            onClick={() => toggleLikeSong(song.id)}
            className="btn-icon"
            title={isLiked ? "Unlike" : "Like"}
            style={{ color: isLiked ? '#ec4899' : 'var(--text-muted)', padding: '4px' }}
          >
            <Heart size={16} fill={isLiked ? '#ec4899' : 'none'} />
          </button>

          {/* More actions menu trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="btn-icon"
            title="More options"
            style={{ color: menuOpen ? 'var(--primary)' : 'var(--text-muted)', padding: '4px' }}
          >
            <MoreVertical size={16} />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              right: 0,
              marginBottom: '6px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
              zIndex: 30,
              minWidth: '140px',
              padding: '0.35rem 0',
              backdropFilter: 'blur(12px)',
              animation: 'fadeIn 0.15s ease'
            }}>
              <button
                onClick={handlePlayNext}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.45rem 0.75rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <PlayCircle size={14} color="var(--primary)" />
                Play Next
              </button>
              <button
                onClick={handleAddToQueue}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.45rem 0.75rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <ListPlus size={14} />
                Add to Queue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
