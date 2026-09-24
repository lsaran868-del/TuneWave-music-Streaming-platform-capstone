import React from 'react';
import { Search, Sparkles, User, LogIn, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';

export default function Navbar({ searchQuery, setSearchQuery, activeTab, setActiveTab }) {
  const { user, isAuthModalOpen, setIsAuthModalOpen, isBackendConnected } = useAuth();
  const { setIsCreatePlaylistOpen } = useAudio();

  return (
    <header style={{
      height: '70px',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-light)',
      background: 'rgba(9, 9, 11, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Search Input Bar */}
      <div style={{ position: 'relative', width: '380px' }}>
        <Search size={18} style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)'
        }} />
        <input
          type="text"
          placeholder="Search songs, artists, genres, or moods..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (activeTab !== 'search' && e.target.value.trim().length > 0) {
              setActiveTab('search');
            }
          }}
          style={{
            width: '100%',
            padding: '0.6rem 1rem 0.6rem 2.6rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-light)',
            color: 'var(--text-main)',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
        />
      </div>

      {/* Action Buttons & Status Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* AI Generator Shortcut */}
        <button
          onClick={() => setActiveTab('ai-discovery')}
          style={{
            background: 'linear-gradient(135deg, rgba(29,185,84,0.15) 0%, rgba(6,182,212,0.15) 100%)',
            border: '1px solid rgba(29,185,84,0.4)',
            color: 'var(--primary)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(29,185,84,0.2)'
          }}
        >
          <Sparkles size={16} />
          <span>AI DJ & Studio</span>
        </button>

        {/* Backend / Supabase Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          background: isBackendConnected ? 'rgba(29,185,84,0.1)' : 'rgba(245,158,11,0.1)',
          color: isBackendConnected ? '#1db954' : '#f59e0b',
          border: `1px solid ${isBackendConnected ? 'rgba(29,185,84,0.3)' : 'rgba(245,158,11,0.3)'}`
        }}>
          {isBackendConnected ? <CheckCircle2 size={13} /> : <Database size={13} />}
          <span>{isBackendConnected ? 'Spring Boot REST + Supabase' : 'Standalone Demo Mode'}</span>
        </div>

        {/* User Auth Section */}
        {user ? (
          <div
            onClick={() => setActiveTab('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              cursor: 'pointer',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-light)'
            }}
          >
            <img
              src={user.avatarUrl}
              alt={user.username}
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.username}</span>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="btn-primary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
          >
            <LogIn size={16} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
