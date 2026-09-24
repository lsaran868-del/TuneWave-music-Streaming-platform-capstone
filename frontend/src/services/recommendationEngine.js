/**
 * TuneWave AI Recommendation Engine
 * Implements Cosine Similarity Vector Matching, Natural Language Prompt Parsing,
 * and Listening History Preference Clustering.
 */

// Calculate Cosine Similarity between two song audio feature vectors
export function calculateCosineSimilarity(featuresA, featuresB) {
  if (!featuresA || !featuresB) return 0;

  // Normalized vector elements [tempo/200, energy, valence, danceability, acousticness]
  const vA = [
    featuresA.tempo / 200,
    featuresA.energy,
    featuresA.valence,
    featuresA.danceability,
    featuresA.acousticness
  ];
  
  const vB = [
    featuresB.tempo / 200,
    featuresB.energy,
    featuresB.valence,
    featuresB.danceability,
    featuresB.acousticness
  ];

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vA.length; i++) {
    dotProduct += vA[i] * vB[i];
    normA += vA[i] * vA[i];
    normB += vB[i] * vB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Find similar songs to a target track
export function getSimilarSongs(targetSong, allSongs, limit = 5) {
  if (!targetSong || !allSongs) return [];

  return allSongs
    .filter(s => s.id !== targetSong.id)
    .map(song => ({
      song,
      score: calculateCosineSimilarity(targetSong.features, song.features)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => ({
      ...item.song,
      matchPercentage: Math.round(item.score * 100)
    }));
}

// Parse natural language prompt into target audio features
export function parsePromptToAudioFeatures(promptText) {
  const text = promptText.toLowerCase();
  
  let target = {
    tempo: 100,
    energy: 0.5,
    valence: 0.5,
    danceability: 0.5,
    acousticness: 0.5,
    preferredGenres: []
  };

  // Keyword matchers
  if (text.includes("workout") || text.includes("gym") || text.includes("energetic") || text.includes("pumping")) {
    target.energy = 0.90;
    target.tempo = 135;
    target.danceability = 0.85;
    target.acousticness = 0.05;
    target.preferredGenres.push("EDM", "Techno", "Funk");
  } else if (text.includes("study") || text.includes("focus") || text.includes("code") || text.includes("coding")) {
    target.energy = 0.40;
    target.tempo = 90;
    target.valence = 0.55;
    target.acousticness = 0.65;
    target.preferredGenres.push("Lo-Fi", "Synthwave", "Ambient");
  } else if (text.includes("chill") || text.includes("relax") || text.includes("sleep") || text.includes("calm")) {
    target.energy = 0.20;
    target.tempo = 70;
    target.valence = 0.40;
    target.acousticness = 0.88;
    target.preferredGenres.push("Ambient", "Lo-Fi", "Jazz");
  } else if (text.includes("happy") || text.includes("party") || text.includes("dance") || text.includes("upbeat")) {
    target.energy = 0.85;
    target.valence = 0.90;
    target.danceability = 0.90;
    target.tempo = 120;
    target.preferredGenres.push("Funk", "Acoustic", "EDM");
  } else if (text.includes("dark") || text.includes("cyberpunk") || text.includes("night")) {
    target.energy = 0.80;
    target.valence = 0.35;
    target.danceability = 0.75;
    target.tempo = 124;
    target.preferredGenres.push("Synthwave", "Techno");
  }

  return target;
}

// Generate an AI Playlist from prompt or custom feature weights
export function generateAIPlaylist({ prompt, targetFeatures, songCatalog, count = 5 }) {
  let target = targetFeatures;
  if (prompt && !targetFeatures) {
    target = parsePromptToAudioFeatures(prompt);
  }

  if (!target || !songCatalog || songCatalog.length === 0) return [];

  const scoredSongs = songCatalog.map(song => {
    // Distance match
    const normTempoDist = Math.abs(song.features.tempo - target.tempo) / 100;
    const energyDist = Math.abs(song.features.energy - target.energy);
    const valenceDist = Math.abs(song.features.valence - target.valence);
    const danceDist = Math.abs(song.features.danceability - target.danceability);
    const acousticDist = Math.abs(song.features.acousticness - target.acousticness);

    const totalDist = (normTempoDist + energyDist + valenceDist + danceDist + acousticDist) / 5;
    let score = Math.max(0, 1 - totalDist);

    // Genre boost if matching preferred genres
    if (target.preferredGenres && target.preferredGenres.includes(song.genre)) {
      score += 0.15;
    }

    return {
      song,
      score: Math.min(1.0, score)
    };
  });

  return scoredSongs
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(item => ({
      ...item.song,
      matchPercentage: Math.round(item.score * 100)
    }));
}

// Recommend tracks based on user's listening history & liked songs
export function getUserPersonalizedRecommendations(userHistory, likedSongs, songCatalog, count = 6) {
  if (!songCatalog || songCatalog.length === 0) return [];

  // Combine user history IDs & liked IDs
  const userSeedSongIds = new Set([...userHistory.map(h => h.songId || h.id), ...likedSongs]);

  if (userSeedSongIds.size === 0) {
    // Default to top stream count songs if no history yet
    return [...songCatalog].sort((a, b) => b.streamCount - a.streamCount).slice(0, count);
  }

  const seedSongs = songCatalog.filter(s => userSeedSongIds.has(s.id));
  
  if (seedSongs.length === 0) {
    return songCatalog.slice(0, count);
  }

  // Calculate average audio feature vector of user preferences
  const avgFeatures = seedSongs.reduce((acc, song) => {
    acc.tempo += song.features.tempo;
    acc.energy += song.features.energy;
    acc.valence += song.features.valence;
    acc.danceability += song.features.danceability;
    acc.acousticness += song.features.acousticness;
    return acc;
  }, { tempo: 0, energy: 0, valence: 0, danceability: 0, acousticness: 0 });

  const len = seedSongs.length;
  avgFeatures.tempo /= len;
  avgFeatures.energy /= len;
  avgFeatures.valence /= len;
  avgFeatures.danceability /= len;
  avgFeatures.acousticness /= len;

  // Rank candidate songs outside seed set (or entire set if small)
  const candidateSongs = songCatalog.filter(s => !userSeedSongIds.has(s.id));
  const pool = candidateSongs.length >= count ? candidateSongs : songCatalog;

  return pool
    .map(song => ({
      song,
      score: calculateCosineSimilarity(avgFeatures, song.features)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(item => ({
      ...item.song,
      matchPercentage: Math.round(item.score * 100)
    }));
}
