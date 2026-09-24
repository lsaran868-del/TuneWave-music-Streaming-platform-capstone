package com.tunewave.musicplayer.service;

import com.tunewave.musicplayer.dto.ListeningHistoryDto;
import com.tunewave.musicplayer.model.ListeningHistory;
import com.tunewave.musicplayer.model.Song;
import com.tunewave.musicplayer.model.User;
import com.tunewave.musicplayer.repository.ListeningHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListeningHistoryService {

    private final ListeningHistoryRepository historyRepository;
    private final UserService userService;
    private final SongService songService;

    @Transactional
    public ListeningHistoryDto recordPlayEvent(String userId, String songId, Integer durationSeconds) {
        User user = userService.findUserEntityById(userId);
        Song song = songService.findSongEntityById(songId);

        ListeningHistory history = ListeningHistory.builder()
                .user(user)
                .song(song)
                .playDurationSeconds(durationSeconds)
                .playedAt(LocalDateTime.now())
                .build();

        // Increment stream count
        songService.incrementStreamCount(songId);

        ListeningHistory saved = historyRepository.save(history);
        return ListeningHistoryDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ListeningHistoryDto> getUserHistory(String userId) {
        return historyRepository.findTop50ByUserIdOrderByPlayedAtDesc(userId).stream()
                .map(ListeningHistoryDto::fromEntity)
                .collect(Collectors.toList());
    }
}
