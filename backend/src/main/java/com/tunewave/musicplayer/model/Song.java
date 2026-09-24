package com.tunewave.musicplayer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "songs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Song {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artist;

    private String album;

    private Integer duration; // in seconds

    @Column(nullable = false)
    private String audioUrl;

    private String coverUrl;

    private String genre;

    private String mood;

    @Embedded
    private AudioFeatures features;

    @Builder.Default
    private Long streamCount = 0L;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
