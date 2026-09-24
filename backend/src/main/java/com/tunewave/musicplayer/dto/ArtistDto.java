package com.tunewave.musicplayer.dto;

import com.tunewave.musicplayer.model.Artist;

public class ArtistDto {
    private String id;
    private String name;
    private String bio;
    private String imageUrl;
    private String genres;
    private Integer songCount;
    private Integer albumCount;

    public ArtistDto() {}

    public ArtistDto(String id, String name, String bio, String imageUrl, String genres, Integer songCount, Integer albumCount) {
        this.id = id;
        this.name = name;
        this.bio = bio;
        this.imageUrl = imageUrl;
        this.genres = genres;
        this.songCount = songCount;
        this.albumCount = albumCount;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String name;
        private String bio;
        private String imageUrl;
        private String genres;
        private Integer songCount;
        private Integer albumCount;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder bio(String bio) { this.bio = bio; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder genres(String genres) { this.genres = genres; return this; }
        public Builder songCount(Integer songCount) { this.songCount = songCount; return this; }
        public Builder albumCount(Integer albumCount) { this.albumCount = albumCount; return this; }
        public ArtistDto build() {
            return new ArtistDto(id, name, bio, imageUrl, genres, songCount, albumCount);
        }
    }

    public static ArtistDto fromEntity(Artist artist) {
        if (artist == null) return null;
        return ArtistDto.builder()
                .id(artist.getId())
                .name(artist.getName())
                .bio(artist.getBio())
                .imageUrl(artist.getImageUrl())
                .genres(artist.getGenres())
                .songCount(artist.getSongs() != null ? artist.getSongs().size() : 0)
                .albumCount(artist.getAlbums() != null ? artist.getAlbums().size() : 0)
                .build();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getGenres() { return genres; }
    public void setGenres(String genres) { this.genres = genres; }

    public Integer getSongCount() { return songCount; }
    public void setSongCount(Integer songCount) { this.songCount = songCount; }

    public Integer getAlbumCount() { return albumCount; }
    public void setAlbumCount(Integer albumCount) { this.albumCount = albumCount; }
}
