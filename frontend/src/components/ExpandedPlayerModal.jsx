import React, { useState } from 'react';
import {
  X,
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  ListMusic,
  Sparkles,
  Disc,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import AudioVisualizer from './AudioVisualizer';
import { getSimilarSongs } from '../services/recommendationEngine';

export default function ExpandedPlayerModal() {
  const {
    currentTrack,
    isPlaying,
    isLoadingAudio,
    playbackError,
    dismissPlaybackError,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isExpandedPlayerOpen,
    setIsExpandedPlayerOpen,
    isQueueOpen,
    setIsQueueOpen,
    togglePlayPause,
    handleNextTrack,
    handlePrevTrack,
    seekTo,
    setVolume,
    setIsMuted,
    setIsShuffle,
    cycleRepeatMode,
    likedSongIds,
    toggleLikeSong,
    songs,
    playTrack
  } = useAudio();

  const [activeTab, setActiveTab] = useState('visualizer'); // 'visualizer' | 'features' | 'similar'

  if (!isExpandedPlayerOpen || !currentTrack) return null;

  const isLiked = likedSongIds.has(currentTrack.id);
  const similarTracks = getSimilarSongs(currentTrack, songs, 4);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

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
        filter: 'blur(80px) brightness(0.22) saturate(1.8)',
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
        padding: '1.25rem 2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Disc size={24} color="var(--primary)" className={isPlaying ? 'spin-slow' : ''} />
          <span style={{ fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            NOW PLAYING &bull; TUNEWAVE IMMERSIVE
          </span>
        </div>

        {/* View Selector Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(0,0,0,0.45)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-light)',
          backdropFilter: 'blur(10px)'
        }}>
          <button
            onClick={() => setActiveTab('visualizer')}
            style={{
              padding: '0.4rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === 'visualizer' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'visualizer' ? '#000' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Visualizer
          </button>
          <button
            onClick={() => setActiveTab('features')}
            style={{
              padding: '0.4rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === 'features' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'features' ? '#000' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Audio AI Features
          </button>
          <button
            onClick={() => setActiveTab('similar')}
            style={{
              padding: '0.4rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === 'similar' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'similar' ? '#000' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Similar Matches
          </button>
        </div>

        <button
          onClick={() => setIsExpandedPlayerOpen(false)}
          className="btn-icon"
          title="Close Fullscreen View"
          style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '50%', width: '40px', height: '40px' }}
        >
          <X size={22} />
        </button>
      </div>

      {/* Main Grid Body */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 420px) 1fr',
        gap: '3rem',
        padding: '0.5rem 3rem 1.5rem',
        maxWidth: '1350px',
        margin: '0 auto',
        width: '100%',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {/* Left Column: Cover Art & Meta Info */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              style={{
                width: '320px',
                height: '320px',
                borderRadius: 'var(--radius-lg)',
                objectFit: 'cover',
                boxShadow: isPlaying
                  ? '0 25px 60px rgba(29, 185, 84, 0.25), 0 15px 35px rgba(0, 0, 0, 0.8)'
                  : '0 20px 45px rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                transition: 'box-shadow 0.4s ease'
              }}
            />
            {isLoadingAudio && (
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <Loader2 size={36} color="var(--primary)" className="spin-slow" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Buffering stream...</span>
              </div>
            )}
          </div>

          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{currentTrack.title}</h2>
              <button
                onClick={() => toggleLikeSong(currentTrack.id)}
                className="btn-icon"
                title={isLiked ? "Unlike" : "Like"}
                style={{ color: isLiked ? '#ec4899' : 'var(--text-muted)' }}
              >
                <Heart size={22} fill={isLiked ? '#ec4899' : 'none'} />
              </button>
            </div>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.25rem' }}>
              {currentTrack.artist}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">{currentTrack.genre || 'Music'}</span>
              {currentTrack.mood && <span className="badge badge-cyan">{currentTrack.mood}</span>}
              <span className="badge badge-purple">{currentTrack.features?.tempo || 120} BPM</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Tab Content */}
        <div className="glass-panel" style={{
          padding: '2rem',
          height: '420px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(18, 18, 24, 0.65)'
        }}>
          {activeTab === 'visualizer' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isPlaying ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: isPlaying ? '0 0 10px var(--primary)' : 'none'
                }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '0.05em' }}>
                  LIVE AUDIO FREQUENCY SPECTRUM
                </h3>
              </div>
              <AudioVisualizer width={520} height={200} barColor="#1db954" />
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '420px', margin: 0 }}>
                Real-time Web Audio API AnalyserNode rendering frequency domain data at 60 FPS.
              </p>
            </div>
          )}

          {activeTab === 'features' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Sparkles size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Song Audio Feature Analysis</h3>
              </div>

              {Object.entries(currentTrack.features || {
                energy: 0.85,
                danceability: 0.78,
                valence: 0.65,
                acousticness: 0.22,
                tempo: 124
              }).map(([key, val]) => {
                const isBpm = key === 'tempo';
                const percent = isBpm ? Math.min(100, Math.round((val / 180) * 100)) : Math.round(val * 100);
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
            <div style={{ overflowY: 'auto', maxHeight: '100%' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--primary)" />
                Vector Cosine Similarity Matches
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
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
                      transition: 'all 0.2s ease',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
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

      {/* Error alert banner inside modal if playback fails */}
      {playbackError && (
        <div style={{
          position: 'relative',
          zIndex: 20,
          margin: '0 auto 0.75rem',
          maxWidth: '700px',
          background: 'rgba(239, 68, 68, 0.95)',
          color: '#fff',
          padding: '0.6rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: 600 }}>
            <AlertTriangle size={18} />
            <span>{playbackError}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleNextTrack}
              style={{
                background: '#fff',
                color: '#ef4444',
                border: 'none',
                padding: '0.25rem 0.6rem',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Skip Next
            </button>
            <button
              onClick={dismissPlaybackError}
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Playback Control Bar */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        background: 'rgba(10, 10, 14, 0.85)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-light)',
        padding: '1.25rem 3rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {/* Progress Bar & Timers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '40px', textAlign: 'right', fontWeight: 600 }}>
            {formatTime(currentTime)}
          </span>
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              seekTo(ratio * (duration || 0));
            }}
            style={{
              flex: 1,
              height: '6px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '3px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'height 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.height = '8px'}
            onMouseLeave={(e) => e.currentTarget.style.height = '6px'}
          >
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'var(--primary)',
              borderRadius: '3px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                right: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 0 8px rgba(0,0,0,0.6)'
              }} />
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '40px', fontWeight: 600 }}>
            {formatTime(duration)}
          </span>
        </div>

        {/* Action Controls Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {/* Left: Shuffle & Repeat */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '150px' }}>
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className="btn-icon"
              title={isShuffle ? "Shuffle On" : "Shuffle Off"}
              style={{ color: isShuffle ? 'var(--primary)' : 'var(--text-muted)' }}
            >
              <Shuffle size={20} />
            </button>
            <button
              onClick={cycleRepeatMode}
              className="btn-icon"
              title={`Repeat: ${repeatMode}`}
              style={{ color: repeatMode !== 'off' ? 'var(--primary)' : 'var(--text-muted)', position: 'relative' }}
            >
              {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
              {repeatMode === 'all' && (
                <span style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  fontSize: '0.6rem',
                  fontWeight: 900,
                  lineHeight: 1
                }}>
                  •
                </span>
              )}
            </button>
          </div>

          {/* Center: Play / Pause / Skip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={handlePrevTrack}
              className="btn-icon"
              title="Previous Track"
              style={{ color: 'var(--text-main)', transform: 'scale(1.15)' }}
            >
              <SkipBack size={26} fill="currentColor" />
            </button>

            <button
              onClick={togglePlayPause}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#000',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(29, 185, 84, 0.45)',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isLoadingAudio ? (
                <Loader2 size={26} color="#000" className="spin-slow" />
              ) : isPlaying ? (
                <Pause size={28} fill="#000" />
              ) : (
                <Play size={28} fill="#000" style={{ marginLeft: '3px' }} />
              )}
            </button>

            <button
              onClick={handleNextTrack}
              className="btn-icon"
              title="Next Track"
              style={{ color: 'var(--text-main)', transform: 'scale(1.15)' }}
            >
              <SkipForward size={26} fill="currentColor" />
            </button>
          </div>

          {/* Right: Volume & Queue */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '150px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="btn-icon"
              title={isMuted ? "Unmute" : "Mute"}
              style={{ color: isMuted ? '#ef4444' : 'var(--text-muted)' }}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              style={{
                width: '90px',
                accentColor: 'var(--primary)',
                cursor: 'pointer'
              }}
            />

            <button
              onClick={() => setIsQueueOpen(!isQueueOpen)}
              className="btn-icon"
              title="Toggle Queue"
              style={{ color: isQueueOpen ? 'var(--primary)' : 'var(--text-muted)', marginLeft: '0.5rem' }}
            >
              <ListMusic size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
