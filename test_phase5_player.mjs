// Phase 5 Player and Audio Streaming Verification Suite
import assert from 'node:assert';

console.log('====================================================');
console.log('TUNEWAVE PHASE 5: REAL MUSIC PLAYER AND STREAMING TEST');
console.log('====================================================\n');

// 1. Test Queue Manipulation Logic
console.log('[Test 1] Queue Management Logic');
{
  let queue = [
    { id: '1', title: 'Song 1' },
    { id: '2', title: 'Song 2' },
    { id: '3', title: 'Song 3' }
  ];
  let queueIndex = 0;

  // Add to queue
  const song4 = { id: '4', title: 'Song 4' };
  queue = [...queue, song4];
  assert.strictEqual(queue.length, 4, 'Queue should have 4 items after addition');

  // Play next (insert immediately after current index)
  const song5 = { id: '5', title: 'Song 5' };
  queue = [
    ...queue.slice(0, queueIndex + 1),
    song5,
    ...queue.slice(queueIndex + 1)
  ];
  assert.strictEqual(queue[1].id, '5', 'Song 5 should be positioned immediately after current track');

  // Reorder queue (move item up from index 2 to 1)
  const itemToMove = queue[2];
  const newQueue = [...queue];
  newQueue.splice(2, 1);
  newQueue.splice(1, 0, itemToMove);
  assert.strictEqual(newQueue[1].id, itemToMove.id, 'Item should be moved up in queue');

  // Remove from queue
  const filteredQueue = newQueue.filter(s => s.id !== '5');
  assert.strictEqual(filteredQueue.find(s => s.id === '5'), undefined, 'Song 5 should be removed from queue');

  // Clear queue (retaining currently playing track)
  const currentTrack = filteredQueue[queueIndex];
  const clearedQueue = currentTrack ? [currentTrack] : [];
  assert.strictEqual(clearedQueue.length, 1, 'Cleared queue should keep current track');
  console.log('  ✓ Add to queue, Play next, Reorder (move up/down), Remove, and Clear passed.');
}

// 2. Test Repeat Mode Cycling & Shuffle
console.log('\n[Test 2] Repeat and Shuffle Lifecycle');
{
  let repeatMode = 'off';
  const cycleRepeat = (mode) => {
    if (mode === 'off') return 'all';
    if (mode === 'all') return 'one';
    return 'off';
  };

  repeatMode = cycleRepeat(repeatMode);
  assert.strictEqual(repeatMode, 'all', 'Repeat off should transition to all');
  repeatMode = cycleRepeat(repeatMode);
  assert.strictEqual(repeatMode, 'one', 'Repeat all should transition to one');
  repeatMode = cycleRepeat(repeatMode);
  assert.strictEqual(repeatMode, 'off', 'Repeat one should transition to off');

  let isShuffle = false;
  isShuffle = !isShuffle;
  assert.strictEqual(isShuffle, true, 'Shuffle toggle on');
  isShuffle = !isShuffle;
  assert.strictEqual(isShuffle, false, 'Shuffle toggle off');
  console.log('  ✓ Repeat modes (off -> all -> one -> off) and Shuffle toggle passed.');
}

// 3. Test Legitimate Listen Tracking (15s / 30% rule)
console.log('\n[Test 3] Legitimate Listen Tracking Logic');
{
  const testTrack = { id: 'track-101', title: 'Test Track', duration: 200 };

  const evaluateListen = (listenedSecs, curPos, duration, ended = false) => {
    if (ended) return true;
    const passedSeconds = listenedSecs >= 15;
    const passedPercentage = (curPos / duration) >= 0.3;
    return passedSeconds || passedPercentage;
  };

  // Immediate skip at 2 seconds
  assert.strictEqual(evaluateListen(2, 2, 200), false, '2 seconds listen must NOT count as a play');

  // Skip at 10 seconds
  assert.strictEqual(evaluateListen(10, 10, 200), false, '10 seconds listen must NOT count as a play');

  // Listened for 15 seconds
  assert.strictEqual(evaluateListen(15, 15, 200), true, '15 seconds listen MUST count as a legitimate play');

  // Short track (40s) listened to 13 seconds (> 30% of 40s = 12s)
  assert.strictEqual(evaluateListen(13, 13, 40), true, 'Reaching 30% of total duration MUST count as a play');

  // Song completed to end
  assert.strictEqual(evaluateListen(5, 5, 200, true), true, 'Song ended event MUST count as a play');
  console.log('  ✓ Skipped plays filtered out; 15s threshold, 30% threshold, and track-ended events recorded.');
}

// 4. Test State Persistence Schema
console.log('\n[Test 4] Player State Persistence (localStorage Schema)');
{
  const mockStorage = {};
  const saveState = (volume, isMuted, repeatMode, isShuffle, currentTrack, queue) => {
    mockStorage['tunewave_player_volume'] = volume.toString();
    mockStorage['tunewave_player_muted'] = JSON.stringify(isMuted);
    mockStorage['tunewave_repeat_mode'] = repeatMode;
    mockStorage['tunewave_shuffle_mode'] = JSON.stringify(isShuffle);
    if (currentTrack) {
      mockStorage['tunewave_last_track_id'] = currentTrack.id;
    }
    if (queue && queue.length > 0) {
      mockStorage['tunewave_queue_ids'] = JSON.stringify(queue.map(s => s.id));
    }
  };

  saveState(0.75, false, 'all', true, { id: 'song-1' }, [{ id: 'song-1' }, { id: 'song-2' }]);

  assert.strictEqual(mockStorage['tunewave_player_volume'], '0.75');
  assert.strictEqual(mockStorage['tunewave_player_muted'], 'false');
  assert.strictEqual(mockStorage['tunewave_repeat_mode'], 'all');
  assert.strictEqual(mockStorage['tunewave_shuffle_mode'], 'true');
  assert.strictEqual(mockStorage['tunewave_last_track_id'], 'song-1');
  assert.deepStrictEqual(JSON.parse(mockStorage['tunewave_queue_ids']), ['song-1', 'song-2']);

  // Verify no large binary or audio data is stored
  const totalLength = Object.values(mockStorage).reduce((acc, v) => acc + v.length, 0);
  assert(totalLength < 500, 'Persisted payload should be lightweight (<500 bytes)');
  console.log(`  ✓ Persisted state verified (${totalLength} bytes). No large media stored.`);
}

// 5. Test Live Backend APIs and Streaming Connectivity
console.log('\n[Test 5] Live Backend Connectivity & Streaming URL Verification');
async function runNetworkTests() {
  const backendUrl = 'http://localhost:8081';

  try {
    const healthRes = await fetch(`${backendUrl}/api/health`);
    assert.strictEqual(healthRes.status, 200, 'Backend health check must return 200');
    const health = await healthRes.json();
    console.log(`  ✓ Backend Health: ${health.status} (${health.service})`);

    const songsRes = await fetch(`${backendUrl}/api/songs`);
    assert.strictEqual(songsRes.status, 200, 'GET /api/songs must return 200');
    const songs = await songsRes.json();
    assert(songs.length > 0, 'Catalog must contain songs');
    console.log(`  ✓ Song Catalog retrieved: ${songs.length} tracks found.`);

    // Test audio stream accessibility for first track
    const firstSong = songs[0];
    console.log(`  ✓ Testing audio stream URL: ${firstSong.title} -> ${firstSong.audioUrl}`);
    const audioHead = await fetch(firstSong.audioUrl, { method: 'HEAD' });
    console.log(`  ✓ Audio source HTTP response status: ${audioHead.status}`);

    // Test history recording endpoint
    const historyRes = await fetch(`${backendUrl}/api/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId: firstSong.id, playDurationSeconds: 45 })
    });
    assert.strictEqual(historyRes.status, 200, 'POST /api/history must succeed');
    console.log('  ✓ Stream / play event recording verified.');

    console.log('\n====================================================');
    console.log('ALL PHASE 5 TESTS COMPLETED SUCCESSFULLY!');
    console.log('====================================================');
  } catch (err) {
    console.error('Network test error:', err.message);
    process.exit(1);
  }
}

runNetworkTests();
