import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Play, Pause, Heart, Clock, Music2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { GENRE_PRESETS } from '../data/initialSongs';
import { api } from '../services/api';

export default function Search({ searchQuery, setSearchQuery }) {
  const { songs, playTrack, currentTrack, isPlaying, togglePlayPause, likedSongIds, toggleLikeSong } = useAudio();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Query real backend for search and genre filters
  useEffect(() => {
    let isCurrent = true;

    const performSearch = async () => {
      if (!searchQuery && !selectedGenre) {
        setSearchResults(null);
        return;
      }

      setIsSearching(true);
      try {
        let results = [];
        if (selectedGenre && !searchQuery) {
          results = await api.getSongsByGenre(selectedGenre);
        } else if (searchQuery) {
          results = await api.searchSongs(searchQuery);
          if (selectedGenre) {
            results = results.filter(s => s.genre?.toLowerCase() === selectedGenre.toLowerCase());
          }
        }

        if (isCurrent) {
          setSearchResults(results);
        }
      } catch (err) {
        console.warn('Backend search error, falling back to local dataset:', err);
      } finally {
        if (isCurrent) setIsSearching(false);
      }
    };

    const timer = setTimeout(performSearch, 200);
    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedGenre]);

  // Use searchResults if an active query/filter exists; otherwise use full catalog
  const displaySongs = (searchResults !== null) ? searchResults : songs;

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="page-body animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Search Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Explore & Discover Music</h1>
        <p style={{ color: 'var(--text-muted)' }}>Browse by genres, moods, or search for your favorite artists and titles.</p>
      </div>

      {/* Genre Pills Category Cards */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Browse All Genres</h2>
          {selectedGenre && (
            <button
              onClick={() => setSelectedGenre(null)}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Clear Genre Filter ({selectedGenre})
            </button>
          )}
        </div>

        <div className="genre-grid">
          {GENRE_PRESETS.map(preset => {
            const isSelected = selectedGenre === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => setSelectedGenre(isSelected ? null : preset.id)}
                style={{
                  height: '100px',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  background: isSelected 
                    ? 'var(--primary)' 
                    : `linear-gradient(135deg, rgba(29,185,84,0.15) 0%, rgba(6,182,212,0.15) 100%)`,
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 15px var(--primary-glow)' : 'none'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: isSelected ? '#000' : 'var(--text-main)' }}>
                  {preset.name}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: isSelected ? '#000' : 'var(--text-subtle)' }}>
                  Explore Tracks
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Results Table Section */}
      <section className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
          {searchQuery || selectedGenre ? `Search Results (${displaySongs.length} tracks found)` : `All Catalog Tracks (${displaySongs.length})`}
        </h2>

        {isSearching ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Searching TuneWave music catalog...
          </div>
        ) : displaySongs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No tracks found matching your query or genre filter.
          </div>
        ) : (
          <table className="songs-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Title & Artist</th>
                <th>Genre & Mood</th>
                <th>Stream Count</th>
                <th><Clock size={16} /></th>
                <th style={{ width: '80px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {displaySongs.map((song, index) => {
                const isCurrent = currentTrack?.id === song.id;
                const isLiked = likedSongIds.has(song.id);
                return (
                  <tr key={song.id} className={isCurrent ? 'active-row' : ''}>
                    <td style={{ fontWeight: 600 }}>{index + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: isCurrent ? 'var(--primary)' : 'var(--text-main)' }}>
                            {song.title}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {song.artist} • {song.album}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <span className="badge badge-primary">{song.genre}</span>
                        {song.mood && <span className="badge badge-cyan">{song.mood}</span>}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      {song.streamCount?.toLocaleString()} plays
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      {formatTime(song.duration)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          onClick={() => {
                            if (isCurrent) togglePlayPause();
                            else playTrack(song, displaySongs);
                          }}
                          className="btn-icon"
                          style={{ color: isCurrent ? 'var(--primary)' : 'var(--text-main)' }}
                        >
                          {isCurrent && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                        </button>
                        <button
                          onClick={() => toggleLikeSong(song.id)}
                          className="btn-icon"
                          style={{ color: isLiked ? '#ec4899' : 'var(--text-muted)' }}
                        >
                          <Heart size={16} fill={isLiked ? '#ec4899' : 'none'} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
