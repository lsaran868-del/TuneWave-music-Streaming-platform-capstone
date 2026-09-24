package com.tunewave.musicplayer.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "playlists")
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private String coverUrl;

    private Boolean isPublic = true;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "playlist_songs",
        joinColumns = @JoinColumn(name = "playlist_id"),
        inverseJoinColumns = @JoinColumn(name = "song_id")
    )
    private List<Song> songs = new ArrayList<>();

    private String createdBy;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Playlist() {}

    public Playlist(String id, User owner, String title, String description, String coverUrl, Boolean isPublic, List<Song> songs, String createdBy, LocalDateTime createdAt) {
        this.id = id;
        this.owner = owner;
        this.title = title;
        this.description = description;
        this.coverUrl = coverUrl;
        this.isPublic = isPublic != null ? isPublic : true;
        if (songs != null) this.songs = songs;
        this.createdBy = createdBy;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private User owner;
        private String title;
        private String description;
        private String coverUrl;
        private Boolean isPublic = true;
        private List<Song> songs = new ArrayList<>();
        private String createdBy;
        private LocalDateTime createdAt = LocalDateTime.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder owner(User owner) { this.owner = owner; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder coverUrl(String coverUrl) { this.coverUrl = coverUrl; return this; }
        public Builder isPublic(Boolean isPublic) { this.isPublic = isPublic; return this; }
        public Builder songs(List<Song> songs) { if (songs != null) this.songs = songs; return this; }
        public Builder createdBy(String createdBy) { this.createdBy = createdBy; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Playlist build() {
            return new Playlist(id, owner, title, description, coverUrl, isPublic, songs, createdBy, createdAt);
        }
    }

    public String getOwnerId() {
        return owner != null ? owner.getId() : null;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }

    public List<Song> getSongs() { return songs; }
    public void setSongs(List<Song> songs) { this.songs = songs; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
