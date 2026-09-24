// Rich Curated Music Catalog with Audio Feature Vectors & Working Audio Streams
export const INITIAL_SONGS = [
  {
    id: "song-1",
    title: "Cyberpunk Horizon",
    artist: "SynthWave Pulse",
    album: "Neon Dreams 2088",
    duration: 198,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cyberpunk-synthwave-21215.mp3",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
    genre: "Synthwave",
    mood: "Energetic",
    features: {
      tempo: 124,
      energy: 0.88,
      valence: 0.72,
      danceability: 0.81,
      acousticness: 0.05
    },
    streamCount: 14250
  },
  {
    id: "song-2",
    title: "Midnight Lo-Fi Study",
    artist: "Aura Beats",
    album: "Coffee & Code",
    duration: 165,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a7315b.mp3?filename=lofi-study-112191.mp3",
    coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80",
    genre: "Lo-Fi",
    mood: "Chill",
    features: {
      tempo: 84,
      energy: 0.35,
      valence: 0.50,
      danceability: 0.62,
      acousticness: 0.78
    },
    streamCount: 28900
  },
  {
    id: "song-3",
    title: "Starlight Reverie",
    artist: "Celestial Waves",
    album: "Deep Cosmos",
    duration: 210,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f7e5b2.mp3?filename=ambient-piano-124483.mp3",
    coverUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80",
    genre: "Ambient",
    mood: "Relaxing",
    features: {
      tempo: 72,
      energy: 0.22,
      valence: 0.38,
      danceability: 0.28,
      acousticness: 0.92
    },
    streamCount: 9800
  },
  {
    id: "song-4",
    title: "Electric Velocity",
    artist: "Vortex 99",
    album: "Overdrive",
    duration: 184,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=energetic-rock-10023.mp3",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    genre: "EDM",
    mood: "Workout",
    features: {
      tempo: 132,
      energy: 0.94,
      valence: 0.85,
      danceability: 0.89,
      acousticness: 0.02
    },
    streamCount: 35100
  },
  {
    id: "song-5",
    title: "Velvet Afternoon",
    artist: "Luna Jazz Trio",
    album: "Rainy Cafe Sessions",
    duration: 225,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c3527b140d.mp3?filename=smooth-jazz-110022.mp3",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    genre: "Jazz",
    mood: "Chill",
    features: {
      tempo: 96,
      energy: 0.42,
      valence: 0.65,
      danceability: 0.58,
      acousticness: 0.84
    },
    streamCount: 16700
  },
  {
    id: "song-6",
    title: "Acoustic Sunrays",
    artist: "Oliver Vance",
    album: "Golden Horizon",
    duration: 178,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/11/06/audio_c29f9e9d6d.mp3?filename=acoustic-guitar-chill-126748.mp3",
    coverUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80",
    genre: "Acoustic",
    mood: "Happy",
    features: {
      tempo: 108,
      energy: 0.55,
      valence: 0.88,
      danceability: 0.64,
      acousticness: 0.81
    },
    streamCount: 22300
  },
  {
    id: "song-7",
    title: "Hyperdrive Funk",
    artist: "Groove Mechanics",
    album: "Future Soul",
    duration: 202,
    audioUrl: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_9242d547f3.mp3?filename=funk-groovy-beat-9040.mp3",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    genre: "Funk",
    mood: "Party",
    features: {
      tempo: 118,
      energy: 0.82,
      valence: 0.91,
      danceability: 0.93,
      acousticness: 0.12
    },
    streamCount: 18900
  },
  {
    id: "song-8",
    title: "Tokyo Rain Reflections",
    artist: "Kaito Chill",
    album: "Shinjuku After Hours",
    duration: 190,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/02/07/audio_a16d5668db.mp3?filename=chill-lofi-song-8444.mp3",
    coverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    genre: "Lo-Fi",
    mood: "Focus",
    features: {
      tempo: 80,
      energy: 0.38,
      valence: 0.44,
      danceability: 0.60,
      acousticness: 0.68
    },
    streamCount: 41200
  },
  {
    id: "song-9",
    title: "Neon Pulse Arcade",
    artist: "Retro Nova",
    album: "1984 Revisited",
    duration: 214,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_24e3933c16.mp3?filename=synthwave-80s-retro-125302.mp3",
    coverUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    genre: "Synthwave",
    mood: "Nostalgic",
    features: {
      tempo: 120,
      energy: 0.79,
      valence: 0.68,
      danceability: 0.75,
      acousticness: 0.08
    },
    streamCount: 15400
  },
  {
    id: "song-10",
    title: "ZenITH Mountain Echo",
    artist: "Himalaya Meditation",
    album: "Solitude",
    duration: 240,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65675e25.mp3?filename=meditation-relax-11116.mp3",
    coverUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    genre: "Ambient",
    mood: "Relaxing",
    features: {
      tempo: 65,
      energy: 0.15,
      valence: 0.30,
      danceability: 0.18,
      acousticness: 0.95
    },
    streamCount: 8300
  },
  {
    id: "song-11",
    title: "Shadows in Berlin",
    artist: "Klaus Electro",
    album: "Underground Vault",
    duration: 205,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6b16e4e.mp3?filename=techno-dark-beat-10332.mp3",
    coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
    genre: "Techno",
    mood: "Dark",
    features: {
      tempo: 128,
      energy: 0.91,
      valence: 0.40,
      danceability: 0.84,
      acousticness: 0.01
    },
    streamCount: 26800
  },
  {
    id: "song-12",
    title: "Cascading Strings",
    artist: "Vienna Chamber Collective",
    album: "Modern Classical Transcends",
    duration: 230,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/24/audio_3387eb77c3.mp3?filename=classical-orchestra-115201.mp3",
    coverUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80",
    genre: "Classical",
    mood: "Dramatic",
    features: {
      tempo: 90,
      energy: 0.45,
      valence: 0.52,
      danceability: 0.30,
      acousticness: 0.90
    },
    streamCount: 11200
  }
];

export const INITIAL_PLAYLISTS = [
  {
    id: "pl-1",
    title: "⚡ Late Night Code Flow",
    description: "Deep synthwave, electro & lo-fi beats designed for max coding productivity and focus.",
    coverUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    songIds: ["song-1", "song-2", "song-8", "song-9"],
    createdBy: "TuneWave Editor",
    isPublic: true,
    createdAt: "2026-08-01"
  },
  {
    id: "pl-2",
    title: "☕ Chill Coffee Shop Vibes",
    description: "Smooth jazz trio & warm acoustic melodies for relaxing afternoons.",
    coverUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
    songIds: ["song-5", "song-6", "song-2", "song-3"],
    createdBy: "TuneWave Editor",
    isPublic: true,
    createdAt: "2026-08-05"
  },
  {
    id: "pl-3",
    title: "🔥 High Voltage Workout",
    description: "Pumping EDM, high BPM techno, and aggressive hyperdrive basslines.",
    coverUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    songIds: ["song-4", "song-7", "song-11", "song-1"],
    createdBy: "TuneWave Editor",
    isPublic: true,
    createdAt: "2026-08-08"
  }
];

export const GENRE_PRESETS = [
  { id: "synthwave", name: "Synthwave", color: "from-purple-600 to-indigo-900", icon: "Radio" },
  { id: "lo-fi", name: "Lo-Fi", color: "from-amber-600 to-orange-900", icon: "Coffee" },
  { id: "edm", name: "EDM / Techno", color: "from-emerald-600 to-teal-900", icon: "Zap" },
  { id: "ambient", name: "Ambient", color: "from-blue-600 to-cyan-900", icon: "Cloud" },
  { id: "jazz", name: "Jazz & Soul", color: "from-rose-600 to-pink-900", icon: "Music" },
  { id: "acoustic", name: "Acoustic", color: "from-lime-600 to-green-900", icon: "Smile" },
  { id: "classical", name: "Classical", color: "from-violet-600 to-purple-900", icon: "BookOpen" },
  { id: "funk", name: "Funk & Disco", color: "from-fuchsia-600 to-pink-900", icon: "Disc" }
];
