import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  ListMusic,
  Maximize2,
  Loader2,
  AlertTriangle,
  X
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import AudioVisualizer from './AudioVisualizer';

export default function PlayerBar() {
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
    likedSongIds,
    isQueueOpen,
    togglePlayPause,
    handleNextTrack,
    handlePrevTrack,
    seekTo,
    setVolume,
    setIsMuted,
    setIsShuffle,
    setRepeatMode,
    toggleLikeSong,
    setIsQueueOpen,
    setIsExpandedPlayerOpen
  } = useAudio();

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentTrack) return null;

  const isLiked = likedSongIds.has(currentTrack.id);

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (volume === 0) setVolume(0.5);
    } else {
      setIsMuted(true);
    }
  };

  return (
    <>
      {/* Playback Error Banner */}
      {playbackError && (
        <div style={{
          position: 'fixed',
          bottom: 'calc(var(--player-height) + 12px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 60,
          background: 'rgba(239, 68, 68, 0.95)',
          backdropFilter: 'blur(12px)',
          color: '#ffffff',
          padding: '0.6rem 1.25rem',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
          fontSize: '0.85rem',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease'
        }}>
          <AlertTriangle size={18} />
          <span>{playbackError}</span>
          <button
            onClick={handleNextTrack}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            Play Next
          </button>
          <button
            onClick={dismissPlaybackError}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <footer style={{
        height: 'var(--player-height)',
        background: 'rgba(12, 12, 16, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50
      }}>
        {/* Left: Track Thumbnail & Meta Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '240px', maxWidth: '300px' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsExpandedPlayerOpen(true)}>
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
            />
          </div>
          
          <div style={{ overflow: 'hidden' }}>
            <div
              onClick={() => setIsExpandedPlayerOpen(true)}
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
              }}
            >
              {currentTrack.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentTrack.artist}
            </div>
          </div>

          <button
            onClick={() => toggleLikeSong(currentTrack.id)}
            className="btn-icon"
            style={{ color: isLiked ? '#ec4899' : 'var(--text-muted)' }}
          >
            <Heart size={20} fill={isLiked ? '#ec4899' : 'none'} />
          </button>
        </div>

        {/* Center: Playback Controls & Scrubber */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1, maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Shuffle Toggle */}
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`btn-icon ${isShuffle ? 'active' : ''}`}
              title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
              style={{ color: isShuffle ? 'var(--primary)' : 'var(--text-muted)' }}
            >
              <Shuffle size={18} />
            </button>

            {/* Previous Track */}
            <button onClick={handlePrevTrack} className="btn-icon" title="Previous Track">
              <SkipBack size={20} />
            </button>

            {/* Play/Pause/Loading Button */}
            <button
              onClick={togglePlayPause}
              disabled={isLoadingAudio}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#000',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isLoadingAudio ? 'wait' : 'pointer',
                boxShadow: '0 4px 15px var(--primary-glow)',
                transition: 'transform 0.15s ease',
                position: 'relative'
              }}
            >
              {isLoadingAudio ? (
                <Loader2 size={20} className="animate-spin" color="#000" />
              ) : isPlaying ? (
                <Pause size={22} fill="#000" />
              ) : (
                <Play size={22} fill="#000" style={{ marginLeft: '2px' }} />
              )}
            </button>

            {/* Next Track */}
            <button onClick={handleNextTrack} className="btn-icon" title="Next Track">
              <SkipForward size={20} />
            </button>

            {/* Repeat Mode Toggle */}
            <button
              onClick={() => {
                if (repeatMode === 'off') setRepeatMode('all');
                else if (repeatMode === 'all') setRepeatMode('one');
                else setRepeatMode('off');
              }}
              className={`btn-icon ${repeatMode !== 'off' ? 'active' : ''}`}
              title={`Repeat: ${repeatMode.toUpperCase()}`}
              style={{ color: repeatMode !== 'off' ? 'var(--primary)' : 'var(--text-muted)' }}
            >
              {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
            </button>
          </div>

          {/* Progress Scrubber Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', minWidth: '35px', textAlign: 'right' }}>
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              style={{ flex: 1, cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', minWidth: '35px' }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Audio Visualizer, Volume, Queue & Expand Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '240px', justifyContent: 'flex-end' }}>
          {/* Live Spectrum Canvas Visualizer */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '2px 6px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px' }}>
            <AudioVisualizer width={80} height={28} barColor="#1db954" />
          </div>

          {/* Volume Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '110px' }}>
            <button onClick={handleToggleMute} className="btn-icon">
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>

          {/* Queue Drawer Toggle */}
          <button
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            className={`btn-icon ${isQueueOpen ? 'active' : ''}`}
            title="Queue"
            style={{ color: isQueueOpen ? 'var(--primary)' : 'var(--text-muted)' }}
          >
            <ListMusic size={20} />
          </button>

          {/* Expanded Fullscreen View */}
          <button
            onClick={() => setIsExpandedPlayerOpen(true)}
            className="btn-icon"
            title="Expand View"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </footer>
    </>
  );
}
