import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { INITIAL_SONGS, INITIAL_PLAYLISTS } from '../data/initialSongs';
import { api } from '../services/api';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [songs, setSongs] = useState(INITIAL_SONGS);
  const [playlists, setPlaylists] = useState(INITIAL_PLAYLISTS);
  const [currentTrack, setCurrentTrack] = useState(INITIAL_SONGS[0]);
  const [queue, setQueue] = useState(INITIAL_SONGS);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  
  const [likedSongIds, setLikedSongIds] = useState(new Set(['song-1', 'song-4', 'song-6']));
  const [listeningHistory, setListeningHistory] = useState([
    { id: 'h-1', song: INITIAL_SONGS[0], playedAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'h-2', song: INITIAL_SONGS[3], playedAt: new Date(Date.now() - 7200000).toISOString() }
  ]);

  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isExpandedPlayerOpen, setIsExpandedPlayerOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);

  // Audio & Web Audio API Visualizer References
  const audioRef = useRef(new Audio());
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  // Initialize Web Audio API nodes for visualizer
  const initWebAudioAPI = () => {
    if (!audioCtxRef.current) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
        analyserRef.current = audioCtxRef.current.createAnalyser();
        analyserRef.current.fftSize = 64; // Frequency bins count
        
        if (audioRef.current && !sourceRef.current) {
          sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioCtxRef.current.destination);
        }
      } catch (err) {
        console.warn('Web Audio API not allowed or restricted by browser policy:', err);
      }
    } else if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Sync audio source when currentTrack changes
  useEffect(() => {
    if (!currentTrack) return;
    const audio = audioRef.current;
    audio.src = currentTrack.audioUrl;
    audio.currentTime = 0;
    setCurrentTime(0);

    if (isPlaying) {
      audio.play().catch(e => {
        console.warn('Audio autoplay blocked, click play to resume:', e);
        setIsPlaying(false);
      });
    }
  }, [currentTrack]);

  // Attach event listeners to audio element
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || currentTrack?.duration || 0);
    
    const handleEnded = () => {
      // Log to history
      logPlayHistory(currentTrack);

      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, repeatMode, queueIndex, queue, isShuffle]);

  // Volume & Mute sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Log listening event
  const logPlayHistory = (song) => {
    if (!song) return;
    const newEntry = {
      id: `hist-${Date.now()}`,
      song,
      playedAt: new Date().toISOString()
    };
    setListeningHistory(prev => [newEntry, ...prev.slice(0, 49)]); // keep last 50
    api.logPlayEvent(song.id, Math.round(currentTime));
  };

  // Playback Control Handlers
  const playTrack = (track, newQueue = null) => {
    initWebAudioAPI();
    
    if (newQueue) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(s => s.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else if (currentTrack?.id !== track.id) {
      const idx = queue.findIndex(s => s.id === track.id);
      if (idx >= 0) {
        setQueueIndex(idx);
      } else {
        setQueue(prev => [track, ...prev]);
        setQueueIndex(0);
      }
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    audioRef.current.play().catch(() => {});
  };

  const togglePlayPause = () => {
    initWebAudioAPI();
    if (!currentTrack && songs.length > 0) {
      playTrack(songs[0]);
      return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleNextTrack = () => {
    if (queue.length === 0) return;
    
    let nextIdx;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = queueIndex + 1;
      if (nextIdx >= queue.length) {
        nextIdx = repeatMode === 'all' ? 0 : queue.length - 1;
      }
    }

    setQueueIndex(nextIdx);
    setCurrentTrack(queue[nextIdx]);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    if (queue.length === 0) return;

    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = repeatMode === 'all' ? queue.length - 1 : 0;
    }

    setQueueIndex(prevIdx);
    setCurrentTrack(queue[prevIdx]);
    setIsPlaying(true);
  };

  const seekTo = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const toggleLikeSong = (songId) => {
    setLikedSongIds(prev => {
      const next = new Set(prev);
      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
      }
      return next;
    });
  };

  const createPlaylist = (title, description, coverUrl) => {
    const newPl = {
      id: `pl-${Date.now()}`,
      title,
      description: description || 'User custom created playlist',
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      songIds: [],
      createdBy: 'You',
      isPublic: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPlaylists(prev => [newPl, ...prev]);
    api.createPlaylist(newPl);
    return newPl;
  };

  const addSongToPlaylist = (playlistId, songId) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        if (pl.songIds.includes(songId)) return pl;
        return { ...pl, songIds: [...pl.songIds, songId] };
      }
      return pl;
    }));
  };

  const removeSongFromPlaylist = (playlistId, songId) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        return { ...pl, songIds: pl.songIds.filter(id => id !== songId) };
      }
      return pl;
    }));
  };

  return (
    <AudioContext.Provider value={{
      songs,
      playlists,
      currentTrack,
      queue,
      queueIndex,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      isShuffle,
      repeatMode,
      likedSongIds,
      listeningHistory,
      isQueueOpen,
      isExpandedPlayerOpen,
      isCreatePlaylistOpen,
      analyserRef,
      playTrack,
      togglePlayPause,
      handleNextTrack,
      handlePrevTrack,
      seekTo,
      setVolume,
      setIsMuted,
      setIsShuffle,
      setRepeatMode,
      toggleLikeSong,
      createPlaylist,
      addSongToPlaylist,
      removeSongFromPlaylist,
      setIsQueueOpen,
      setIsExpandedPlayerOpen,
      setIsCreatePlaylistOpen,
      setQueue
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
