import React from 'react';
import { User, LogOut, ShieldCheck, Database, Zap, Heart, Disc, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';

export default function Profile() {
  const { user, logout, isBackendConnected, setIsAuthModalOpen, setAuthMode } = useAuth();
  const { playlists, likedSongIds, listeningHistory } = useAudio();

  if (!user) {
    return (
      <div className="page-body animate-fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(29, 185, 84, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(29, 185, 84, 0.25)',
          color: 'var(--primary)'
        }}>
          <User size={40} />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome to TuneWave</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '420px', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Sign in or register to view your personal listening profile, customize your playlists, and sync your audio history.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
            className="btn-primary"
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
          >
            <span>Sign In</span>
          </button>
          <button
            onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
            className="btn-secondary"
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
          >
            <span>Create Account</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Profile Header */}
      <div className="glass-panel" style={{
        padding: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        background: 'linear-gradient(135deg, rgba(29, 185, 84, 0.15) 0%, rgba(9, 9, 11, 0.95) 100%)'
      }}>
        <img
          src={user.avatarUrl}
          alt={user.username}
          style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: '0 8px 25px rgba(29,185,84,0.3)' }}
        />
        <div style={{ flex: 1 }}>
          <div className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
            {user.plan || 'PREMIUM PRO'} MEMBER
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>{user.username}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{user.email}</p>
        </div>

        <button onClick={logout} className="btn-secondary" style={{ color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Listening Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(29,185,84,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{user.totalHoursListened || 142.5} hrs</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Streaming Time</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(236,72,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={22} color="#ec4899" />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{likedSongIds.size}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Liked Songs Saved</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Disc size={22} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{playlists.length}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Custom Playlists</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={22} color="var(--accent-purple)" />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{user.topGenre || 'Synthwave'}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Top Preference Genre</div>
          </div>
        </div>
      </div>

      {/* Backend & Supabase Database Connectivity Status */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>System Architecture & Settings</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Database size={22} color="var(--primary)" />
              <div>
                <div style={{ fontWeight: 700 }}>Spring Boot REST Backend API</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Target Endpoint: http://localhost:8080/api (JWT Auth & Caching enabled)
                </div>
              </div>
            </div>
            <div className={`badge ${isBackendConnected ? 'badge-primary' : 'badge-cyan'}`}>
              {isBackendConnected ? 'Connected Live' : 'Demo Fallback Active'}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <ShieldCheck size={22} color="var(--accent-purple)" />
              <div>
                <div style={{ fontWeight: 700 }}>Supabase PostgreSQL Database & Storage</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Schema & Seed scripts available in /supabase directory
                </div>
              </div>
            </div>
            <div className="badge badge-purple">
              Configured
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
