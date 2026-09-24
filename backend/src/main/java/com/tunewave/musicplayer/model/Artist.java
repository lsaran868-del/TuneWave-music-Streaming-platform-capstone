package com.tunewave.musicplayer.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "artists")
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String bio;

    private String imageUrl;

    private String genres;

    @OneToMany(mappedBy = "artist", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Song> songs = new ArrayList<>();

    @OneToMany(mappedBy = "artist", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Album> albums = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    public Artist() {}

    public Artist(String id, String name, String bio, String imageUrl, String genres, List<Song> songs, List<Album> albums, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.bio = bio;
        this.imageUrl = imageUrl;
        this.genres = genres;
        if (songs != null) this.songs = songs;
        if (albums != null) this.albums = albums;
        if (createdAt != null) this.createdAt = createdAt;
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
        private List<Song> songs = new ArrayList<>();
        private List<Album> albums = new ArrayList<>();
        private LocalDateTime createdAt = LocalDateTime.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder bio(String bio) { this.bio = bio; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder genres(String genres) { this.genres = genres; return this; }
        public Builder songs(List<Song> songs) { if (songs != null) this.songs = songs; return this; }
        public Builder albums(List<Album> albums) { if (albums != null) this.albums = albums; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Artist build() {
            return new Artist(id, name, bio, imageUrl, genres, songs, albums, createdAt);
        }
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

    public List<Song> getSongs() { return songs; }
    public void setSongs(List<Song> songs) { this.songs = songs; }

    public List<Album> getAlbums() { return albums; }
    public void setAlbums(List<Album> albums) { this.albums = albums; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
