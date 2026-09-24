package com.tunewave.musicplayer.dto;

import com.tunewave.musicplayer.model.ListeningHistory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListeningHistoryDto {
    private String id;
    private String userId;
    private String songId;
    private String songTitle;
    private String artist;
    private Integer playDurationSeconds;
    private LocalDateTime playedAt;

    public static ListeningHistoryDto fromEntity(ListeningHistory history) {
        if (history == null) return null;
        return ListeningHistoryDto.builder()
                .id(history.getId())
                .userId(history.getUser() != null ? history.getUser().getId() : null)
                .songId(history.getSong() != null ? history.getSong().getId() : null)
                .songTitle(history.getSong() != null ? history.getSong().getTitle() : null)
                .artist(history.getSong() != null ? history.getSong().getArtistDisplayName() : null)
                .playDurationSeconds(history.getPlayDurationSeconds())
                .playedAt(history.getPlayedAt())
                .build();
    }
}
