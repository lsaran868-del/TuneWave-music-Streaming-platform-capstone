import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AudioProvider } from './context/AudioContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import PlayerBar from './components/PlayerBar';
import QueueDrawer from './components/QueueDrawer';
import ExpandedPlayerModal from './components/ExpandedPlayerModal';
import CreatePlaylistModal from './components/CreatePlaylistModal';
import AuthModal from './components/AuthModal';

import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import PlaylistDetail from './pages/PlaylistDetail';
import AIDiscovery from './pages/AIDiscovery';
import Profile from './pages/Profile';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} setSelectedPlaylistId={setSelectedPlaylistId} />;
      case 'search':
        return <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
      case 'library':
        return <Library setActiveTab={setActiveTab} setSelectedPlaylistId={setSelectedPlaylistId} />;
      case 'playlist-detail':
        return <PlaylistDetail playlistId={selectedPlaylistId} />;
      case 'ai-discovery':
        return <AIDiscovery setActiveTab={setActiveTab} setSelectedPlaylistId={setSelectedPlaylistId} />;
      case 'profile':
        return <Profile />;
      default:
        return <Home setActiveTab={setActiveTab} setSelectedPlaylistId={setSelectedPlaylistId} />;
    }
  };

  return (
    <AuthProvider>
      <AudioProvider>
        <div className="app-container">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setSelectedPlaylistId={setSelectedPlaylistId}
          />

          <div className="main-content">
            <Navbar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <main style={{ flex: 1 }}>
              {renderCurrentPage()}
            </main>
          </div>

          <PlayerBar />
          <QueueDrawer />
          <ExpandedPlayerModal />
          <CreatePlaylistModal />
          <AuthModal />
        </div>
      </AudioProvider>
    </AuthProvider>
  );
}
