package com.tunewave.musicplayer.dto;

import com.tunewave.musicplayer.model.User;
import java.time.LocalDateTime;

public class UserProfileDto {
    private String id;
    private String email;
    private String username;
    private String avatarUrl;
    private String bio;
    private String plan;
    private Double totalHoursListened;
    private Integer playlistCount;
    private Integer favoriteCount;
    private LocalDateTime createdAt;

    public UserProfileDto() {}

    public UserProfileDto(String id, String email, String username, String avatarUrl, String bio,
                          String plan, Double totalHoursListened, Integer playlistCount, Integer favoriteCount, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.avatarUrl = avatarUrl;
        this.bio = bio;
        this.plan = plan;
        this.totalHoursListened = totalHoursListened;
        this.playlistCount = playlistCount;
        this.favoriteCount = favoriteCount;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String email;
        private String username;
        private String avatarUrl;
        private String bio;
        private String plan;
        private Double totalHoursListened;
        private Integer playlistCount;
        private Integer favoriteCount;
        private LocalDateTime createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder username(String username) { this.username = username; return this; }
        public Builder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public Builder bio(String bio) { this.bio = bio; return this; }
        public Builder plan(String plan) { this.plan = plan; return this; }
        public Builder totalHoursListened(Double totalHoursListened) { this.totalHoursListened = totalHoursListened; return this; }
        public Builder playlistCount(Integer playlistCount) { this.playlistCount = playlistCount; return this; }
        public Builder favoriteCount(Integer favoriteCount) { this.favoriteCount = favoriteCount; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public UserProfileDto build() {
            return new UserProfileDto(id, email, username, avatarUrl, bio, plan, totalHoursListened, playlistCount, favoriteCount, createdAt);
        }
    }

    public static UserProfileDto fromEntity(User user) {
        if (user == null) return null;
        return UserProfileDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .plan(user.getPlan())
                .totalHoursListened(user.getTotalHoursListened())
                .playlistCount(user.getPlaylists() != null ? user.getPlaylists().size() : 0)
                .favoriteCount(user.getFavorites() != null ? user.getFavorites().size() : 0)
                .createdAt(user.getCreatedAt())
                .build();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

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

    public Integer getPlaylistCount() { return playlistCount; }
    public void setPlaylistCount(Integer playlistCount) { this.playlistCount = playlistCount; }

    public Integer getFavoriteCount() { return favoriteCount; }
    public void setFavoriteCount(Integer favoriteCount) { this.favoriteCount = favoriteCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
