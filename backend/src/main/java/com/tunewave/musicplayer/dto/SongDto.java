package com.tunewave.musicplayer.dto;

import com.tunewave.musicplayer.model.AudioFeatures;
import com.tunewave.musicplayer.model.Song;
import java.time.LocalDateTime;

public class SongDto {
    private String id;
    private String title;
    private String artist;
    private String artistId;
    private String album;
    private String albumId;
    private Integer duration;
    private String audioUrl;
    private String coverUrl;
    private String genre;
    private String mood;
    private String releaseDate;
    private Boolean isExplicit = false;
    private AudioFeatures audioFeatures;
    private Long streamCount = 0L;
    private LocalDateTime createdAt;

    public SongDto() {}

    public SongDto(String id, String title, String artist, String artistId, String album, String albumId,
                   Integer duration, String audioUrl, String coverUrl, String genre, String mood,
                   String releaseDate, Boolean isExplicit, AudioFeatures audioFeatures, Long streamCount, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.artistId = artistId;
        this.album = album;
        this.albumId = albumId;
        this.duration = duration;
        this.audioUrl = audioUrl;
        this.coverUrl = coverUrl;
        this.genre = genre;
        this.mood = mood;
        this.releaseDate = releaseDate;
        this.isExplicit = isExplicit != null ? isExplicit : false;
        this.audioFeatures = audioFeatures;
        this.streamCount = streamCount != null ? streamCount : 0L;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String title;
        private String artist;
        private String artistId;
        private String album;
        private String albumId;
        private Integer duration;
        private String audioUrl;
        private String coverUrl;
        private String genre;
        private String mood;
        private String releaseDate;
        private Boolean isExplicit = false;
        private AudioFeatures audioFeatures;
        private Long streamCount = 0L;
        private LocalDateTime createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder artist(String artist) { this.artist = artist; return this; }
        public Builder artistId(String artistId) { this.artistId = artistId; return this; }
        public Builder album(String album) { this.album = album; return this; }
        public Builder albumId(String albumId) { this.albumId = albumId; return this; }
        public Builder duration(Integer duration) { this.duration = duration; return this; }
        public Builder audioUrl(String audioUrl) { this.audioUrl = audioUrl; return this; }
        public Builder coverUrl(String coverUrl) { this.coverUrl = coverUrl; return this; }
        public Builder genre(String genre) { this.genre = genre; return this; }
        public Builder mood(String mood) { this.mood = mood; return this; }
        public Builder releaseDate(String releaseDate) { this.releaseDate = releaseDate; return this; }
        public Builder isExplicit(Boolean isExplicit) { this.isExplicit = isExplicit; return this; }
        public Builder features(AudioFeatures features) { this.audioFeatures = features; return this; }
        public Builder audioFeatures(AudioFeatures audioFeatures) { this.audioFeatures = audioFeatures; return this; }
        public Builder streamCount(Long streamCount) { this.streamCount = streamCount; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public SongDto build() {
            return new SongDto(id, title, artist, artistId, album, albumId, duration, audioUrl, coverUrl, genre, mood, releaseDate, isExplicit, audioFeatures, streamCount, createdAt);
        }
    }

    public static SongDto fromEntity(Song song) {
        if (song == null) return null;
        return SongDto.builder()
                .id(song.getId())
                .title(song.getTitle())
                .artist(song.getArtistDisplayName())
                .artistId(song.getArtist() != null ? song.getArtist().getId() : null)
                .album(song.getAlbumDisplayTitle())
                .albumId(song.getAlbum() != null ? song.getAlbum().getId() : null)
                .duration(song.getDuration())
                .audioUrl(song.getAudioUrl())
                .coverUrl(song.getCoverUrl())
                .genre(song.getGenre())
                .mood(song.getMood())
                .releaseDate(song.getReleaseDate())
                .isExplicit(song.getIsExplicit())
                .audioFeatures(song.getFeatures())
                .streamCount(song.getStreamCount())
                .createdAt(song.getCreatedAt())
                .build();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getArtist() { return artist; }
    public void setArtist(String artist) { this.artist = artist; }

    public String getArtistId() { return artistId; }
    public void setArtistId(String artistId) { this.artistId = artistId; }

    public String getAlbum() { return album; }
    public void setAlbum(String album) { this.album = album; }

    public String getAlbumId() { return albumId; }
    public void setAlbumId(String albumId) { this.albumId = albumId; }

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

    public AudioFeatures getAudioFeatures() { return audioFeatures; }
    public void setAudioFeatures(AudioFeatures audioFeatures) { this.audioFeatures = audioFeatures; }

    // Compatibility getter/setter for features
    public AudioFeatures getFeatures() { return audioFeatures; }
    public void setFeatures(AudioFeatures features) { this.audioFeatures = features; }

    public Long getStreamCount() { return streamCount; }
    public void setStreamCount(Long streamCount) { this.streamCount = streamCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
