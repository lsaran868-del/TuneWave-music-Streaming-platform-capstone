package com.tunewave.musicplayer.dto;

import com.tunewave.musicplayer.model.ListeningHistory;
import java.time.LocalDateTime;

public class ListeningHistoryDto {
    private String id;
    private String userId;
    private String songId;
    private String songTitle;
    private String artist;
    private Integer playDurationSeconds;
    private LocalDateTime playedAt;

    public ListeningHistoryDto() {}

    public ListeningHistoryDto(String id, String userId, String songId, String songTitle, String artist, Integer playDurationSeconds, LocalDateTime playedAt) {
        this.id = id;
        this.userId = userId;
        this.songId = songId;
        this.songTitle = songTitle;
        this.artist = artist;
        this.playDurationSeconds = playDurationSeconds;
        this.playedAt = playedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String userId;
        private String songId;
        private String songTitle;
        private String artist;
        private Integer playDurationSeconds;
        private LocalDateTime playedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }
        public Builder songId(String songId) { this.songId = songId; return this; }
        public Builder songTitle(String songTitle) { this.songTitle = songTitle; return this; }
        public Builder artist(String artist) { this.artist = artist; return this; }
        public Builder playDurationSeconds(Integer playDurationSeconds) { this.playDurationSeconds = playDurationSeconds; return this; }
        public Builder playedAt(LocalDateTime playedAt) { this.playedAt = playedAt; return this; }
        public ListeningHistoryDto build() {
            return new ListeningHistoryDto(id, userId, songId, songTitle, artist, playDurationSeconds, playedAt);
        }
    }

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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSongId() { return songId; }
    public void setSongId(String songId) { this.songId = songId; }

    public String getSongTitle() { return songTitle; }
    public void setSongTitle(String songTitle) { this.songTitle = songTitle; }

    public String getArtist() { return artist; }
    public void setArtist(String artist) { this.artist = artist; }

    public Integer getPlayDurationSeconds() { return playDurationSeconds; }
    public void setPlayDurationSeconds(Integer playDurationSeconds) { this.playDurationSeconds = playDurationSeconds; }

    public LocalDateTime getPlayedAt() { return playedAt; }
    public void setPlayedAt(LocalDateTime playedAt) { this.playedAt = playedAt; }
}
