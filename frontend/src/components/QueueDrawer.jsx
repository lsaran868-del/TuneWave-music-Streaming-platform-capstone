import React from 'react';
import { X, Play, Trash2, Music2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function QueueDrawer() {
  const { queue, queueIndex, currentTrack, isQueueOpen, setIsQueueOpen, playTrack, setQueue } = useAudio();

  if (!isQueueOpen) return null;

  const removeFromQueue = (idx) => {
    setQueue(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 'var(--player-height)',
      width: '380px',
      background: 'rgba(12, 12, 16, 0.95)',
      backdropFilter: 'blur(24px)',
      borderLeft: '1px solid var(--border-light)',
      zIndex: 45,
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      animation: 'fadeIn 0.25s ease forwards'
    }}>
      {/* Drawer Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Music2 size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Play Queue</h3>
        </div>
        <button onClick={() => setIsQueueOpen(false)} className="btn-icon">
          <X size={20} />
        </button>
      </div>

      {/* Currently Playing Track */}
      {currentTrack && (
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-subtle)', fontWeight: 700 }}>
            NOW PLAYING
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(29, 185, 84, 0.12)',
            border: '1px solid rgba(29, 185, 84, 0.3)',
            marginTop: '0.5rem'
          }}>
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentTrack.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentTrack.artist}</div>
            </div>
          </div>
        </div>
      )}

      {/* Queue Tracks List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-subtle)', fontWeight: 700 }}>
            NEXT UP ({Math.max(0, queue.length - 1)})
          </span>
          {queue.length > 1 && (
            <button
              onClick={() => setQueue([currentTrack])}
              style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              Clear Queue
            </button>
          )}
        </div>

        {queue.map((track, idx) => {
          const isCurrent = idx === queueIndex;
          return (
            <div
              key={`${track.id}-${idx}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: isCurrent ? 'rgba(255,255,255,0.06)' : 'transparent',
                transition: 'background 0.15s ease'
              }}
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', width: '20px' }}>{idx + 1}</span>
              <img
                src={track.coverUrl}
                alt={track.title}
                style={{ width: '38px', height: '38px', borderRadius: '4px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {track.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{track.artist}</div>
              </div>

              <button onClick={() => playTrack(track)} className="btn-icon" title="Play">
                <Play size={16} />
              </button>
              <button onClick={() => removeFromQueue(idx)} className="btn-icon" title="Remove">
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
