package com.tunewave.musicplayer.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "songs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id")
    private Artist artist;

    @Column(name = "artist_name")
    private String artistName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id")
    private Album album;

    @Column(name = "album_title")
    private String albumTitle;

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

    public String getArtistDisplayName() {
        if (artist != null && artist.getName() != null && !artist.getName().isBlank()) {
            return artist.getName();
        }
        return artistName != null ? artistName : "Unknown Artist";
    }

    public String getAlbumDisplayTitle() {
        if (album != null && album.getTitle() != null && !album.getTitle().isBlank()) {
            return album.getTitle();
        }
        return albumTitle != null ? albumTitle : "Single";
    }
}
