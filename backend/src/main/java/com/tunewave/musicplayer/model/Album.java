package com.tunewave.musicplayer.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "albums")
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    private String coverUrl;

    private Integer releaseYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id")
    private Artist artist;

    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Song> songs = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    public Album() {}

    public Album(String id, String title, String coverUrl, Integer releaseYear, Artist artist, List<Song> songs, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.coverUrl = coverUrl;
        this.releaseYear = releaseYear;
        this.artist = artist;
        if (songs != null) this.songs = songs;
        if (createdAt != null) this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String title;
        private String coverUrl;
        private Integer releaseYear;
        private Artist artist;
        private List<Song> songs = new ArrayList<>();
        private LocalDateTime createdAt = LocalDateTime.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder coverUrl(String coverUrl) { this.coverUrl = coverUrl; return this; }
        public Builder releaseYear(Integer releaseYear) { this.releaseYear = releaseYear; return this; }
        public Builder artist(Artist artist) { this.artist = artist; return this; }
        public Builder songs(List<Song> songs) { if (songs != null) this.songs = songs; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Album build() {
            return new Album(id, title, coverUrl, releaseYear, artist, songs, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }

    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }

    public Artist getArtist() { return artist; }
    public void setArtist(Artist artist) { this.artist = artist; }

    public List<Song> getSongs() { return songs; }
    public void setSongs(List<Song> songs) { this.songs = songs; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
