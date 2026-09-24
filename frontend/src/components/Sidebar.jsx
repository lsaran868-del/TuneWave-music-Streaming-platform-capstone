import React from 'react';
import { Home, Compass, Library, Sparkles, Plus, Heart, Music, Disc3, User } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function Sidebar({ activeTab, setActiveTab, setSelectedPlaylistId }) {
  const { playlists, likedSongIds, setIsCreatePlaylistOpen } = useAudio();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Explore & Search', icon: Compass },
    { id: 'library', label: 'Your Library', icon: Library },
    { id: 'ai-discovery', label: 'AI Music Studio', icon: Sparkles, badge: 'AI' },
  ];

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1.25rem',
      gap: '2rem',
      zIndex: 30,
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #1db954 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(29, 185, 84, 0.4)'
        }}>
          <Disc3 size={24} color="#000" style={{ animation: 'spin 12s linear infinite' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Tune<span style={{ color: 'var(--primary)' }}>Wave</span>
          </h1>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            STREAM & DISCOVER
          </p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'rgba(29, 185, 84, 0.12)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                border: isActive ? '1px solid rgba(29, 185, 84, 0.25)' : '1px solid transparent',
                fontSize: '0.92rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Icon size={20} color={isActive ? 'var(--primary)' : 'currentColor'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="badge badge-primary">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Playlists & Library Shortcuts Header */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 0.5rem 0.75rem',
          borderBottom: '1px solid var(--border-light)',
          marginBottom: '0.75rem'
        }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-subtle)', fontWeight: 700 }}>
            PLAYLISTS ({playlists.length + 1})
          </span>
          <button
            onClick={() => setIsCreatePlaylistOpen(true)}
            className="btn-icon"
            title="Create Playlist"
            style={{ color: 'var(--text-muted)' }}
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Scrollable Playlist List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {/* Liked Songs Entry */}
          <button
            onClick={() => {
              setActiveTab('playlist-detail');
              setSelectedPlaylistId('liked-songs');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Heart size={16} fill="#fff" color="#fff" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Liked Songs</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{likedSongIds.size} tracks</div>
            </div>
          </button>

          {/* Custom Playlists */}
          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => {
                setActiveTab('playlist-detail');
                setSelectedPlaylistId(pl.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.2s ease'
              }}
            >
              <img
                src={pl.coverUrl}
                alt={pl.title}
                style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }}
              />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
                  {pl.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                  {pl.songIds.length} tracks
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
