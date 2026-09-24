import React from 'react';
import { X, Play, Trash2, Music2, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function QueueDrawer() {
  const {
    queue,
    queueIndex,
    currentTrack,
    isPlaying,
    isQueueOpen,
    setIsQueueOpen,
    playTrack,
    removeFromQueue,
    clearQueue,
    moveQueueItem
  } = useAudio();

  if (!isQueueOpen) return null;

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
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '12px' }}>
            {queue.length}
          </span>
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
            {isPlaying && (
              <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '14px' }}>
                <span className="visualizer-bar" style={{ width: '3px', height: '100%', background: 'var(--primary)', borderRadius: '1px', animation: 'bounce 0.8s ease infinite alternate' }} />
                <span className="visualizer-bar" style={{ width: '3px', height: '60%', background: 'var(--primary)', borderRadius: '1px', animation: 'bounce 0.6s ease infinite alternate' }} />
                <span className="visualizer-bar" style={{ width: '3px', height: '80%', background: 'var(--primary)', borderRadius: '1px', animation: 'bounce 0.9s ease infinite alternate' }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Queue Tracks List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-subtle)', fontWeight: 700 }}>
            NEXT UP ({Math.max(0, queue.length - 1)})
          </span>
          {queue.length > 1 && (
            <button
              onClick={clearQueue}
              style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
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
                gap: '0.6rem',
                padding: '0.5rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                background: isCurrent ? 'rgba(29, 185, 84, 0.08)' : 'rgba(255,255,255,0.02)',
                border: isCurrent ? '1px solid rgba(29, 185, 84, 0.2)' : '1px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Position and Reorder controls */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', width: '18px' }}>
                {idx > 0 && (
                  <button
                    onClick={() => moveQueueItem(idx, idx - 1)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                    title="Move Up"
                  >
                    <ArrowUp size={12} />
                  </button>
                )}
                <span style={{ fontSize: '0.7rem', color: isCurrent ? 'var(--primary)' : 'var(--text-subtle)', fontWeight: 700 }}>
                  {idx + 1}
                </span>
                {idx < queue.length - 1 && (
                  <button
                    onClick={() => moveQueueItem(idx, idx + 1)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                    title="Move Down"
                  >
                    <ArrowDown size={12} />
                  </button>
                )}
              </div>

              <img
                src={track.coverUrl}
                alt={track.title}
                style={{ width: '38px', height: '38px', borderRadius: '4px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isCurrent ? 'var(--primary)' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {track.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {track.artist}
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => playTrack(track)}
                className="btn-icon"
                title="Play Track Now"
                style={{ color: isCurrent ? 'var(--primary)' : 'var(--text-muted)' }}
              >
                <Play size={15} />
              </button>
              <button
                onClick={() => removeFromQueue(idx)}
                className="btn-icon"
                title="Remove from Queue"
                style={{ color: 'var(--text-muted)' }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
