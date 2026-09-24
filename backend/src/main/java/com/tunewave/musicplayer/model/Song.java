package com.tunewave.musicplayer.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "songs")
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

    @Column(nullable = false, length = 1000)
    private String audioUrl;

    @Column(length = 1000)
    private String coverUrl;

    private String genre;

    private String mood;

    private String releaseDate;

    private Boolean isExplicit = false;

    @Embedded
    private AudioFeatures features;

    private Long streamCount = 0L;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Song() {}

    public Song(String id, String title, Artist artist, String artistName, Album album, String albumTitle,
                Integer duration, String audioUrl, String coverUrl, String genre, String mood,
                String releaseDate, Boolean isExplicit, AudioFeatures features, Long streamCount, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.artistName = artistName;
        this.album = album;
        this.albumTitle = albumTitle;
        this.duration = duration;
        this.audioUrl = audioUrl;
        this.coverUrl = coverUrl;
        this.genre = genre;
        this.mood = mood;
        this.releaseDate = releaseDate;
        this.isExplicit = isExplicit != null ? isExplicit : false;
        this.features = features;
        this.streamCount = streamCount != null ? streamCount : 0L;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String title;
        private Artist artist;
        private String artistName;
        private Album album;
        private String albumTitle;
        private Integer duration;
        private String audioUrl;
        private String coverUrl;
        private String genre;
        private String mood;
        private String releaseDate;
        private Boolean isExplicit = false;
        private AudioFeatures features;
        private Long streamCount = 0L;
        private LocalDateTime createdAt = LocalDateTime.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder artist(Artist artist) { this.artist = artist; return this; }
        public Builder artistName(String artistName) { this.artistName = artistName; return this; }
        public Builder album(Album album) { this.album = album; return this; }
        public Builder albumTitle(String albumTitle) { this.albumTitle = albumTitle; return this; }
        public Builder duration(Integer duration) { this.duration = duration; return this; }
        public Builder audioUrl(String audioUrl) { this.audioUrl = audioUrl; return this; }
        public Builder coverUrl(String coverUrl) { this.coverUrl = coverUrl; return this; }
        public Builder genre(String genre) { this.genre = genre; return this; }
        public Builder mood(String mood) { this.mood = mood; return this; }
        public Builder releaseDate(String releaseDate) { this.releaseDate = releaseDate; return this; }
        public Builder isExplicit(Boolean isExplicit) { this.isExplicit = isExplicit; return this; }
        public Builder features(AudioFeatures features) { this.features = features; return this; }
        public Builder audioFeatures(AudioFeatures features) { this.features = features; return this; }
        public Builder streamCount(Long streamCount) { this.streamCount = streamCount; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Song build() {
            return new Song(id, title, artist, artistName, album, albumTitle, duration, audioUrl, coverUrl, genre, mood, releaseDate, isExplicit, features, streamCount, createdAt);
        }
    }

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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Artist getArtist() { return artist; }
    public void setArtist(Artist artist) { this.artist = artist; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public Album getAlbum() { return album; }
    public void setAlbum(Album album) { this.album = album; }

    public String getAlbumTitle() { return albumTitle; }
    public void setAlbumTitle(String albumTitle) { this.albumTitle = albumTitle; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }

    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getMood() { return mood; }
    public void setMood(String mood) { this.mood = mood; }

    public String getReleaseDate() { return releaseDate; }
    public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }

    public Boolean getIsExplicit() { return isExplicit; }
    public void setIsExplicit(Boolean isExplicit) { this.isExplicit = isExplicit; }

    public AudioFeatures getFeatures() { return features; }
    public void setFeatures(AudioFeatures features) { this.features = features; }

    public AudioFeatures getAudioFeatures() { return features; }
    public void setAudioFeatures(AudioFeatures features) { this.features = features; }

    public Long getStreamCount() { return streamCount; }
    public void setStreamCount(Long streamCount) { this.streamCount = streamCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
