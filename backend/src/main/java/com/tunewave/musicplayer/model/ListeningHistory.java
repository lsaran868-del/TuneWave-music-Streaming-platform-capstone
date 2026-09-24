package com.tunewave.musicplayer.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "listening_history")
public class ListeningHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    private Integer playDurationSeconds;

    private LocalDateTime playedAt = LocalDateTime.now();

    public ListeningHistory() {}

    public ListeningHistory(String id, User user, Song song, Integer playDurationSeconds, LocalDateTime playedAt) {
        this.id = id;
        this.user = user;
        this.song = song;
        this.playDurationSeconds = playDurationSeconds;
        this.playedAt = playedAt != null ? playedAt : LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private User user;
        private Song song;
        private Integer playDurationSeconds;
        private LocalDateTime playedAt = LocalDateTime.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder song(Song song) { this.song = song; return this; }
        public Builder playDurationSeconds(Integer playDurationSeconds) { this.playDurationSeconds = playDurationSeconds; return this; }
        public Builder playedAt(LocalDateTime playedAt) { this.playedAt = playedAt; return this; }
        public ListeningHistory build() {
            return new ListeningHistory(id, user, song, playDurationSeconds, playedAt);
        }
    }

    public String getUserId() {
        return user != null ? user.getId() : null;
    }

    public String getSongId() {
        return song != null ? song.getId() : null;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Song getSong() { return song; }
    public void setSong(Song song) { this.song = song; }

    public Integer getPlayDurationSeconds() { return playDurationSeconds; }
    public void setPlayDurationSeconds(Integer playDurationSeconds) { this.playDurationSeconds = playDurationSeconds; }

    public LocalDateTime getPlayedAt() { return playedAt; }
    public void setPlayedAt(LocalDateTime playedAt) { this.playedAt = playedAt; }
}
