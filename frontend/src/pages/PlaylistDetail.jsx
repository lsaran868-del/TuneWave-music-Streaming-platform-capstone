import React from 'react';
import { Play, Pause, Heart, Trash2, Clock, Music, ListPlus } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function PlaylistDetail({ playlistId }) {
  const { playlists, songs, likedSongIds, currentTrack, isPlaying, playTrack, togglePlayPause, toggleLikeSong, removeSongFromPlaylist, addToQueue } = useAudio();

  let playlistObj = null;
  let playlistSongs = [];

  if (playlistId === 'liked-songs') {
    playlistObj = {
      id: 'liked-songs',
      title: 'Liked Songs',
      description: 'Your personal collection of favorited music tracks.',
      coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
      createdBy: 'You'
    };
    playlistSongs = songs.filter(s => likedSongIds.has(s.id));
  } else {
    playlistObj = playlists.find(p => p.id === playlistId) || playlists[0];
    playlistSongs = songs.filter(s => playlistObj?.songIds?.includes(s.id));
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const totalDuration = playlistSongs.reduce((acc, song) => acc + (song.duration || 0), 0);

  return (
    <div className="page-body animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Playlist Hero Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '2rem',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(180deg, rgba(29,185,84,0.2) 0%, rgba(9,9,11,0.85) 100%)',
        border: '1px solid var(--border-light)'
      }}>
        <img
          src={playlistObj.coverUrl}
          alt={playlistObj.title}
          style={{ width: '200px', height: '200px', borderRadius: 'var(--radius-md)', objectFit: 'cover', boxShadow: '0 15px 35px rgba(0,0,0,0.6)' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, color: 'var(--primary)' }}>
            PLAYLIST
          </span>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.1 }}>{playlistObj.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{playlistObj.description}</p>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginTop: '0.5rem', fontWeight: 600 }}>
            Created by {playlistObj.createdBy} • {playlistSongs.length} songs, {Math.round(totalDuration / 60)} min
          </div>
        </div>
      </div>

      {/* Control Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button
          onClick={() => {
            if (playlistSongs.length > 0) {
              playTrack(playlistSongs[0], playlistSongs);
            }
          }}
          className="btn-primary"
          style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
        >
          <Play size={22} fill="#000" />
          <span>Play Playlist</span>
        </button>
      </div>

      {/* Tracks Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <table className="songs-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>#</th>
              <th>Title & Artist</th>
              <th>Genre</th>
              <th><Clock size={16} /></th>
              <th style={{ width: '100px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {playlistSongs.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No tracks in this playlist yet. Add songs from Explore or Home!
                </td>
              </tr>
            ) : (
              playlistSongs.map((song, index) => {
                const isCurrent = currentTrack?.id === song.id;
                const isLiked = likedSongIds.has(song.id);
                return (
                  <tr key={song.id} className={isCurrent ? 'active-row' : ''}>
                    <td style={{ fontWeight: 600 }}>{index + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img src={song.coverUrl} alt={song.title} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 700, color: isCurrent ? 'var(--primary)' : 'var(--text-main)' }}>
                            {song.title}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{song.artist}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{song.genre}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{formatTime(song.duration)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          onClick={() => {
                            if (isCurrent) togglePlayPause();
                            else playTrack(song, playlistSongs);
                          }}
                          className="btn-icon"
                          style={{ color: isCurrent ? 'var(--primary)' : 'var(--text-main)' }}
                        >
                          {isCurrent && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                        </button>
                        <button
                          onClick={() => addToQueue(song)}
                          className="btn-icon"
                          title="Add to Queue"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <ListPlus size={16} />
                        </button>
                        <button
                          onClick={() => toggleLikeSong(song.id)}
                          className="btn-icon"
                          style={{ color: isLiked ? '#ec4899' : 'var(--text-muted)' }}
                        >
                          <Heart size={16} fill={isLiked ? '#ec4899' : 'none'} />
                        </button>
                        {playlistId !== 'liked-songs' && (
                          <button
                            onClick={() => removeSongFromPlaylist(playlistId, song.id)}
                            className="btn-icon"
                            title="Remove from Playlist"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
