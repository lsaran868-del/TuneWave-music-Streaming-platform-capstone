package com.tunewave.musicplayer.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "listening_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user", "song"})
@EqualsAndHashCode(exclude = {"user", "song"})
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

    @Builder.Default
    private LocalDateTime playedAt = LocalDateTime.now();

    public String getUserId() {
        return user != null ? user.getId() : null;
    }

    public String getSongId() {
        return song != null ? song.getId() : null;
    }
}
