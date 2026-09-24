package com.tunewave.musicplayer.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String username;

    private String avatarUrl;

    @Column(length = 1000)
    private String bio;

    private String plan = "FREE";

    private Double totalHoursListened = 0.0;

    private String role = "ROLE_USER";

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Playlist> playlists = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ListeningHistory> listeningHistory = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "favorites",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "song_id")
    )
    private Set<Song> favorites = new HashSet<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {}

    public User(String id, String email, String passwordHash, String username, String avatarUrl,
                String bio, String plan, Double totalHoursListened, String role,
                List<Playlist> playlists, List<ListeningHistory> listeningHistory, Set<Song> favorites, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.username = username;
        this.avatarUrl = avatarUrl;
        this.bio = bio;
        this.plan = plan != null ? plan : "FREE";
        this.totalHoursListened = totalHoursListened != null ? totalHoursListened : 0.0;
        this.role = role != null ? role : "ROLE_USER";
        if (playlists != null) this.playlists = playlists;
        if (listeningHistory != null) this.listeningHistory = listeningHistory;
        if (favorites != null) this.favorites = favorites;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String email;
        private String passwordHash;
        private String username;
        private String avatarUrl;
        private String bio;
        private String plan = "FREE";
        private Double totalHoursListened = 0.0;
        private String role = "ROLE_USER";
        private List<Playlist> playlists = new ArrayList<>();
        private List<ListeningHistory> listeningHistory = new ArrayList<>();
        private Set<Song> favorites = new HashSet<>();
        private LocalDateTime createdAt = LocalDateTime.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public Builder username(String username) { this.username = username; return this; }
        public Builder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public Builder bio(String bio) { this.bio = bio; return this; }
        public Builder plan(String plan) { this.plan = plan; return this; }
        public Builder totalHoursListened(Double totalHoursListened) { this.totalHoursListened = totalHoursListened; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder playlists(List<Playlist> playlists) { if (playlists != null) this.playlists = playlists; return this; }
        public Builder listeningHistory(List<ListeningHistory> listeningHistory) { if (listeningHistory != null) this.listeningHistory = listeningHistory; return this; }
        public Builder favorites(Set<Song> favorites) { if (favorites != null) this.favorites = favorites; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public User build() {
            return new User(id, email, passwordHash, username, avatarUrl, bio, plan, totalHoursListened, role, playlists, listeningHistory, favorites, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }

    public Double getTotalHoursListened() { return totalHoursListened; }
    public void setTotalHoursListened(Double totalHoursListened) { this.totalHoursListened = totalHoursListened; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<Playlist> getPlaylists() { return playlists; }
    public void setPlaylists(List<Playlist> playlists) { this.playlists = playlists; }

    public List<ListeningHistory> getListeningHistory() { return listeningHistory; }
    public void setListeningHistory(List<ListeningHistory> listeningHistory) { this.listeningHistory = listeningHistory; }

    public Set<Song> getFavorites() { return favorites; }
    public void setFavorites(Set<Song> favorites) { this.favorites = favorites; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
