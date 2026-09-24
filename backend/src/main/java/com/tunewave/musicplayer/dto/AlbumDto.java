package com.tunewave.musicplayer.dto;

import com.tunewave.musicplayer.model.Album;

public class AlbumDto {
    private String id;
    private String title;
    private String coverUrl;
    private Integer releaseYear;
    private String artistId;
    private String artistName;
    private Integer trackCount;

    public AlbumDto() {}

    public AlbumDto(String id, String title, String coverUrl, Integer releaseYear, String artistId, String artistName, Integer trackCount) {
        this.id = id;
        this.title = title;
        this.coverUrl = coverUrl;
        this.releaseYear = releaseYear;
        this.artistId = artistId;
        this.artistName = artistName;
        this.trackCount = trackCount;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String title;
        private String coverUrl;
        private Integer releaseYear;
        private String artistId;
        private String artistName;
        private Integer trackCount;

        public Builder id(String id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder coverUrl(String coverUrl) { this.coverUrl = coverUrl; return this; }
        public Builder releaseYear(Integer releaseYear) { this.releaseYear = releaseYear; return this; }
        public Builder artistId(String artistId) { this.artistId = artistId; return this; }
        public Builder artistName(String artistName) { this.artistName = artistName; return this; }
        public Builder trackCount(Integer trackCount) { this.trackCount = trackCount; return this; }
        public AlbumDto build() {
            return new AlbumDto(id, title, coverUrl, releaseYear, artistId, artistName, trackCount);
        }
    }

    public static AlbumDto fromEntity(Album album) {
        if (album == null) return null;
        return AlbumDto.builder()
                .id(album.getId())
                .title(album.getTitle())
                .coverUrl(album.getCoverUrl())
                .releaseYear(album.getReleaseYear())
                .artistId(album.getArtist() != null ? album.getArtist().getId() : null)
                .artistName(album.getArtist() != null ? album.getArtist().getName() : null)
                .trackCount(album.getSongs() != null ? album.getSongs().size() : 0)
                .build();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }

    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }

    public String getArtistId() { return artistId; }
    public void setArtistId(String artistId) { this.artistId = artistId; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public Integer getTrackCount() { return trackCount; }
    public void setTrackCount(Integer trackCount) { this.trackCount = trackCount; }
}
