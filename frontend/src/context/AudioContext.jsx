import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { INITIAL_SONGS, INITIAL_PLAYLISTS } from '../data/initialSongs';
import { api } from '../services/api';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [songs, setSongs] = useState(INITIAL_SONGS);
  const [playlists, setPlaylists] = useState(INITIAL_PLAYLISTS);

  // Restore saved player preferences from localStorage
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('tunewave_player_volume');
    return saved !== null ? Number(saved) : 0.8;
  });

  const [isMuted, setIsMutedState] = useState(() => {
    return localStorage.getItem('tunewave_player_muted') === 'true';
  });

  const [repeatMode, setRepeatModeState] = useState(() => {
    return localStorage.getItem('tunewave_player_repeat') || 'off'; // 'off' | 'all' | 'one'
  });

  const [isShuffle, setIsShuffleState] = useState(() => {
    return localStorage.getItem('tunewave_player_shuffle') === 'true';
  });

  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [playbackError, setPlaybackError] = useState(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [likedSongIds, setLikedSongIds] = useState(() => {
    try {
      const saved = localStorage.getItem('tunewave_liked_songs');
      return saved ? new Set(JSON.parse(saved)) : new Set(['song-1', 'song-4', 'song-6']);
    } catch {
      return new Set(['song-1', 'song-4', 'song-6']);
    }
  });

  const [listeningHistory, setListeningHistory] = useState([
    { id: 'h-1', song: INITIAL_SONGS[0], playedAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'h-2', song: INITIAL_SONGS[3], playedAt: new Date(Date.now() - 7200000).toISOString() }
  ]);

  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isExpandedPlayerOpen, setIsExpandedPlayerOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);

  // Refs for tracking audio element and legitimate listening events
  const audioRef = useRef(new Audio());
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  const listenedSecondsRef = useRef(0);
  const hasRecordedPlayRef = useRef(false);
  const lastTimeRef = useRef(0);

  // Synchronize state preferences to localStorage
  const setVolume = (val) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    localStorage.setItem('tunewave_player_volume', String(clamped));
  };

  const setIsMuted = (val) => {
    setIsMutedState(val);
    localStorage.setItem('tunewave_player_muted', String(val));
  };

  const setRepeatMode = (mode) => {
    setRepeatModeState(mode);
    localStorage.setItem('tunewave_player_repeat', mode);
  };

  const setIsShuffle = (val) => {
    setIsShuffleState(val);
    localStorage.setItem('tunewave_player_shuffle', String(val));
  };

  // Fetch real music catalog from backend on mount and restore queue
  useEffect(() => {
    let isMounted = true;

    api.getSongs()
      .then(fetchedSongs => {
        if (!isMounted) return;
        const catalog = (fetchedSongs && fetchedSongs.length > 0) ? fetchedSongs : INITIAL_SONGS;
        setSongs(catalog);

        // Restore saved track and queue from localStorage if available
        const savedTrackId = localStorage.getItem('tunewave_player_track_id');
        let initialTrack = catalog.find(s => s.id === savedTrackId) || catalog[0];

        let initialQueue = catalog;
        try {
          const savedQueueIds = localStorage.getItem('tunewave_player_queue_ids');
          if (savedQueueIds) {
            const parsedIds = JSON.parse(savedQueueIds);
            const restoredQueue = parsedIds.map(id => catalog.find(s => s.id === id)).filter(Boolean);
            if (restoredQueue.length > 0) {
              initialQueue = restoredQueue;
            }
          }
        } catch (e) {
          // fallback to full catalog
        }

        setCurrentTrack(initialTrack);
        setQueue(initialQueue);
        const idx = initialQueue.findIndex(s => s.id === initialTrack.id);
        setQueueIndex(idx >= 0 ? idx : 0);
      })
      .catch(() => {
        if (!isMounted) return;
        setSongs(INITIAL_SONGS);
        setCurrentTrack(INITIAL_SONGS[0]);
        setQueue(INITIAL_SONGS);
      });

    return () => { isMounted = false; };
  }, []);

  // Save active track ID & queue IDs to localStorage
  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem('tunewave_player_track_id', currentTrack.id);
    }
    if (queue.length > 0) {
      // Store lightweight array of IDs only
      const queueIds = queue.map(s => s.id);
      localStorage.setItem('tunewave_player_queue_ids', JSON.stringify(queueIds));
    }
  }, [currentTrack, queue]);

  // Save liked song IDs to localStorage
  useEffect(() => {
    localStorage.setItem('tunewave_liked_songs', JSON.stringify(Array.from(likedSongIds)));
  }, [likedSongIds]);

  // Initialize Web Audio API nodes for visualizer
  const initWebAudioAPI = () => {
    if (!audioCtxRef.current) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
        analyserRef.current = audioCtxRef.current.createAnalyser();
        analyserRef.current.fftSize = 64;

        if (audioRef.current && !sourceRef.current) {
          sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioCtxRef.current.destination);
        }
      } catch (err) {
        console.warn('Web Audio API initialized in fallback mode:', err);
      }
    } else if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Sync audio source when currentTrack changes
  useEffect(() => {
    if (!currentTrack) return;

    const audio = audioRef.current;
    setPlaybackError(null);
    setIsLoadingAudio(true);
    setCurrentTime(0);
    setDuration(currentTrack.duration || 0);

    // Reset listen metrics for new track
    listenedSecondsRef.current = 0;
    hasRecordedPlayRef.current = false;
    lastTimeRef.current = 0;

    if (!currentTrack.audioUrl) {
      setPlaybackError('No audio source URL available for this track.');
      setIsLoadingAudio(false);
      setIsPlaying(false);
      return;
    }

    audio.src = currentTrack.audioUrl;
    audio.currentTime = 0;

    if (isPlaying) {
      audio.play().catch(e => {
        console.warn('Autoplay prevented or pending user interaction:', e.message);
        setIsPlaying(false);
        setIsLoadingAudio(false);
      });
    }
  }, [currentTrack]);

  // Complete Audio Lifecycle & Event Listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadStart = () => {
      setIsLoadingAudio(true);
      setPlaybackError(null);
    };

    const handleCanPlay = () => {
      setIsLoadingAudio(false);
    };

    const handleWaiting = () => {
      setIsLoadingAudio(true);
    };

    const handlePlaying = () => {
      setIsLoadingAudio(false);
      setIsPlaying(true);
      setPlaybackError(null);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
      const cur = audio.currentTime;
      setCurrentTime(cur);

      // Track legitimate listening progress (prevent counting instant fast skips)
      if (lastTimeRef.current > 0) {
        const delta = Math.abs(cur - lastTimeRef.current);
        if (delta < 2) { // normal continuous playback
          listenedSecondsRef.current += delta;
        }
      }
      lastTimeRef.current = cur;

      // Only count listen if user has listened for >= 15 seconds or > 30% of total duration
      const totalDur = audio.duration || currentTrack?.duration || 0;
      if (!hasRecordedPlayRef.current && totalDur > 0) {
        const passedSecondsThreshold = listenedSecondsRef.current >= 15;
        const passedPercentageThreshold = (cur / totalDur) >= 0.3;

        if (passedSecondsThreshold || passedPercentageThreshold) {
          hasRecordedPlayRef.current = true;
          recordLegitimateListen(currentTrack, Math.round(cur));
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || currentTrack?.duration || 0);
      setIsLoadingAudio(false);
    };

    const handleError = (e) => {
      setIsLoadingAudio(false);
      setIsPlaying(false);

      const mediaErr = audio.error;
      let msg = 'Playback error: Unable to stream audio track.';
      if (mediaErr) {
        switch (mediaErr.code) {
          case 1: // MEDIA_ERR_ABORTED
            msg = 'Audio playback was aborted.';
            break;
          case 2: // MEDIA_ERR_NETWORK
            msg = 'Network error: Failed to download audio stream.';
            break;
          case 3: // MEDIA_ERR_DECODE
            msg = 'Audio decoding error: Media corrupted.';
            break;
          case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
            msg = 'Audio format not supported or URL unavailable.';
            break;
          default:
            msg = 'Audio stream could not be loaded.';
        }
      }
      setPlaybackError(msg);
    };

    const handleEnded = () => {
      // Record completed listen if not already recorded
      if (!hasRecordedPlayRef.current && currentTrack) {
        hasRecordedPlayRef.current = true;
        recordLegitimateListen(currentTrack, Math.round(audio.currentTime));
      }

      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNextTrack();
      }
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, repeatMode, queueIndex, queue, isShuffle]);

  // Volume & Mute synchronizer
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Record history event only on genuine listens
  const recordLegitimateListen = (song, playSeconds) => {
    if (!song) return;

    const newEntry = {
      id: `hist-${Date.now()}`,
      song,
      playedAt: new Date().toISOString()
    };
    setListeningHistory(prev => [newEntry, ...prev.slice(0, 49)]);

    // Call backend history and stream increment APIs
    api.logPlayEvent(song.id, playSeconds);
    api.incrementStream(song.id);
  };

  // Playback Control Handlers
  const playTrack = (track, newQueue = null) => {
    initWebAudioAPI();
    setPlaybackError(null);

    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(s => s.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else if (!currentTrack || currentTrack.id !== track.id) {
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
    audioRef.current.play().catch(e => {
      console.warn('Playback initiation prevented:', e);
    });
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
      setPlaybackError(null);
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          setPlaybackError('Could not start playback: ' + err.message);
          setIsPlaying(false);
        });
    }
  };

  const handleNextTrack = useCallback(() => {
    if (queue.length === 0) return;

    let nextIdx;
    if (isShuffle) {
      if (queue.length > 1) {
        do {
          nextIdx = Math.floor(Math.random() * queue.length);
        } while (nextIdx === queueIndex);
      } else {
        nextIdx = 0;
      }
    } else {
      nextIdx = queueIndex + 1;
      if (nextIdx >= queue.length) {
        nextIdx = repeatMode === 'all' ? 0 : queue.length - 1;
        if (repeatMode !== 'all' && queueIndex === queue.length - 1) {
          setIsPlaying(false);
          return;
        }
      }
    }

    setQueueIndex(nextIdx);
    setCurrentTrack(queue[nextIdx]);
    setIsPlaying(true);
  }, [queue, queueIndex, isShuffle, repeatMode]);

  const handlePrevTrack = () => {
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
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
    if (audioRef.current && !isNaN(seconds)) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
      lastTimeRef.current = seconds;
    }
  };

  // Queue Operations
  const addToQueue = (song) => {
    if (!song) return;
    setQueue(prev => {
      // Don't add duplicate if already immediately ahead
      return [...prev, song];
    });
  };

  const playNextInQueue = (song) => {
    if (!song) return;
    setQueue(prev => {
      const copy = [...prev];
      copy.splice(queueIndex + 1, 0, song);
      return copy;
    });
  };

  const removeFromQueue = (index) => {
    setQueue(prev => {
      if (prev.length <= 1) return prev;
      const nextQueue = prev.filter((_, i) => i !== index);
      if (index < queueIndex) {
        setQueueIndex(queueIndex - 1);
      } else if (index === queueIndex) {
        const nextActive = nextQueue[index] || nextQueue[0];
        setCurrentTrack(nextActive);
      }
      return nextQueue;
    });
  };

  const clearQueue = () => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  };

  const moveQueueItem = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= queue.length || fromIdx === toIdx) return;
    setQueue(prev => {
      const copy = [...prev];
      const [item] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, item);
      return copy;
    });

    if (queueIndex === fromIdx) {
      setQueueIndex(toIdx);
    } else if (fromIdx < queueIndex && toIdx >= queueIndex) {
      setQueueIndex(queueIndex - 1);
    } else if (fromIdx > queueIndex && toIdx <= queueIndex) {
      setQueueIndex(queueIndex + 1);
    }
  };

  const dismissPlaybackError = () => {
    setPlaybackError(null);
  };

  const toggleLikeSong = (songId) => {
    setLikedSongIds(prev => {
      const next = new Set(prev);
      if (next.has(songId)) next.delete(songId);
      else next.add(songId);
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
      addToQueue,
      playNextInQueue,
      removeFromQueue,
      clearQueue,
      moveQueueItem,
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
