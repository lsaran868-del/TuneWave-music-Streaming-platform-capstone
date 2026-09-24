import React from 'react';
import { Play, Sparkles, TrendingUp, Radio, Heart, Clock } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { getUserPersonalizedRecommendations } from '../services/recommendationEngine';
import SongCard from '../components/SongCard';
import PlaylistCard from '../components/PlaylistCard';

export default function Home({ setActiveTab, setSelectedPlaylistId }) {
  const { songs, playlists, playTrack, listeningHistory, likedSongIds } = useAudio();

  const recommendedSongs = getUserPersonalizedRecommendations(listeningHistory, Array.from(likedSongIds), songs, 6);
  const featuredSong = songs[0];

  return (
    <div className="page-body animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Featured Hero Banner */}
      {featuredSong && (
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          padding: '3rem',
          background: 'linear-gradient(135deg, rgba(29, 185, 84, 0.25) 0%, rgba(6, 182, 212, 0.15) 50%, rgba(9, 9, 11, 0.95) 100%)',
          border: '1px solid rgba(29, 185, 84, 0.3)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem'
        }}>
          <div style={{ zIndex: 2, maxWidth: '600px' }}>
            <div className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
              FEATURED TRACK OF THE WEEK
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '0.75rem' }}>
              {featuredSong.title}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 500 }}>
              By {featuredSong.artist} • {featuredSong.album} ({featuredSong.genre})
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => playTrack(featuredSong, songs)} className="btn-primary">
                <Play size={20} fill="#000" />
                <span>Stream Track Now</span>
              </button>
              <button
                onClick={() => setActiveTab('ai-discovery')}
                className="btn-secondary"
              >
                <Sparkles size={18} color="var(--primary)" />
                <span>AI Remix & Similar</span>
              </button>
            </div>
          </div>

          <img
            src={featuredSong.coverUrl}
            alt={featuredSong.title}
            style={{
              width: '220px',
              height: '220px',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
              zIndex: 2,
              transform: 'rotate(2deg)'
            }}
          />
        </div>
      )}

      {/* AI Personalized Recommendations Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Sparkles size={22} color="var(--primary)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>AI Recommended For You</h2>
          </div>
          <button
            onClick={() => setActiveTab('ai-discovery')}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
          >
            Launch AI Studio →
          </button>
        </div>

        <div className="cards-grid">
          {recommendedSongs.map(song => (
            <SongCard key={song.id} song={song} queueContext={recommendedSongs} />
          ))}
        </div>
      </section>

      {/* Featured Playlists Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Radio size={22} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Curated Playlists & Vibes</h2>
          </div>
        </div>

        <div className="cards-grid">
          {playlists.map(pl => (
            <PlaylistCard
              key={pl.id}
              playlist={pl}
              onClick={() => {
                setActiveTab('playlist-detail');
                setSelectedPlaylistId(pl.id);
              }}
            />
          ))}
        </div>
      </section>

      {/* Top Streamed Charts Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <TrendingUp size={22} color="var(--accent-purple)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Top Trending Tracks</h2>
        </div>

        <div className="cards-grid">
          {[...songs].sort((a, b) => b.streamCount - a.streamCount).slice(0, 5).map(song => (
            <SongCard key={song.id} song={song} queueContext={songs} />
          ))}
        </div>
      </section>
    </div>
  );
}
