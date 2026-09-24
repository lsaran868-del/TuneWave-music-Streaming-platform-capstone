import React, { useState } from 'react';
import { X, Heart, Play, Pause, SkipBack, SkipForward, Sparkles, Activity, Music, Disc } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import AudioVisualizer from './AudioVisualizer';
import { getSimilarSongs } from '../services/recommendationEngine';

export default function ExpandedPlayerModal() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isExpandedPlayerOpen,
    setIsExpandedPlayerOpen,
    togglePlayPause,
    handleNextTrack,
    handlePrevTrack,
    seekTo,
    likedSongIds,
    toggleLikeSong,
    songs,
    playTrack
  } = useAudio();

  const [activeTab, setActiveTab] = useState('visualizer'); // 'visualizer' | 'features' | 'similar'

  if (!isExpandedPlayerOpen || !currentTrack) return null;

  const isLiked = likedSongIds.has(currentTrack.id);
  const similarTracks = getSimilarSongs(currentTrack, songs, 4);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'var(--bg-dark)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* Glowing Ambient Backdrop derived from album art */}
      <div style={{
        position: 'absolute',
        inset: -50,
        backgroundImage: `url(${currentTrack.coverUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(80px) brightness(0.25) saturate(1.8)',
        transform: 'scale(1.2)',
        zIndex: 0
      }} />

      {/* Top Controls Bar */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Disc size={24} color="var(--primary)" />
          <span style={{ fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            NOW PLAYING IN FULLSCREEN
          </span>
        </div>

        {/* View Selector Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(0,0,0,0.4)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-light)'
        }}>
          <button
            onClick={() => setActiveTab('visualizer')}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === 'visualizer' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'visualizer' ? '#000' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Visualizer
          </button>
          <button
            onClick={() => setActiveTab('features')}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === 'features' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'features' ? '#000' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Audio AI Features
          </button>
          <button
            onClick={() => setActiveTab('similar')}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === 'similar' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'similar' ? '#000' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Similar Matches
          </button>
        </div>

        <button onClick={() => setIsExpandedPlayerOpen(false)} className="btn-icon">
          <X size={24} />
        </button>
      </div>

      {/* Main Grid Body */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '450px 1fr',
        gap: '3rem',
        padding: '1rem 3rem 2rem',
        maxWidth: '1300px',
        margin: '0 auto',
        width: '100%',
        alignItems: 'center'
      }}>
        {/* Left Column: Cover Art & Meta Info */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            style={{
              width: '360px',
              height: '360px',
              borderRadius: 'var(--radius-lg)',
              objectFit: 'cover',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          />

          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.35rem' }}>{currentTrack.title}</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500 }}>{currentTrack.artist}</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.75rem' }}>
              <span className="badge badge-primary">{currentTrack.genre}</span>
              <span className="badge badge-cyan">{currentTrack.mood}</span>
              <span className="badge badge-purple">{currentTrack.features?.tempo || 120} BPM</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Tab Content */}
        <div className="glass-panel" style={{ padding: '2rem', height: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {activeTab === 'visualizer' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-muted)' }}>LIVE AUDIO FREQUENCY SPECTRUM</h3>
              <AudioVisualizer width={500} height={180} barColor="#1db954" />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textAlign: 'center', maxWidth: '400px' }}>
                Real-time Web Audio API AnalyserNode rendering frequency domain data at 60 FPS.
              </p>
            </div>
          )}

          {activeTab === 'features' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Sparkles size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Song Audio Feature Analysis</h3>
              </div>

              {Object.entries(currentTrack.features || {}).map(([key, val]) => {
                const isBpm = key === 'tempo';
                const percent = isBpm ? Math.round((val / 180) * 100) : Math.round(val * 100);
                return (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600 }}>
                      <span style={{ textTransform: 'capitalize' }}>{key}</span>
                      <span style={{ color: 'var(--primary)' }}>{isBpm ? `${val} BPM` : `${percent}%`}</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${percent}%`,
                        background: 'linear-gradient(90deg, #1db954 0%, #06b6d4 100%)',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'similar' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
                Vector Cosine Similarity Matches
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {similarTracks.map(item => (
                  <div
                    key={item.id}
                    onClick={() => playTrack(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255,255,255,0.05)',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={item.coverUrl} alt={item.title} style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.artist}</div>
                      </div>
                    </div>
                    <div className="badge badge-primary">
                      {item.matchPercentage}% Cosine Match
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
