package com.tunewave.musicplayer.dto;

import com.tunewave.musicplayer.model.Playlist;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class PlaylistDto {
    private String id;
    private String userId;
    private String title;
    private String description;
    private String coverUrl;
    private Boolean isPublic;
    private String createdBy;
    private Integer songCount;
    private List<SongDto> songs = new ArrayList<>();
    private LocalDateTime createdAt;

    public PlaylistDto() {}

    public PlaylistDto(String id, String userId, String title, String description, String coverUrl,
                       Boolean isPublic, String createdBy, Integer songCount, List<SongDto> songs, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.coverUrl = coverUrl;
        this.isPublic = isPublic;
        this.createdBy = createdBy;
        this.songCount = songCount;
        if (songs != null) this.songs = songs;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String userId;
        private String title;
        private String description;
        private String coverUrl;
        private Boolean isPublic;
        private String createdBy;
        private Integer songCount;
        private List<SongDto> songs = new ArrayList<>();
        private LocalDateTime createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder coverUrl(String coverUrl) { this.coverUrl = coverUrl; return this; }
        public Builder isPublic(Boolean isPublic) { this.isPublic = isPublic; return this; }
        public Builder createdBy(String createdBy) { this.createdBy = createdBy; return this; }
        public Builder songCount(Integer songCount) { this.songCount = songCount; return this; }
        public Builder songs(List<SongDto> songs) { if (songs != null) this.songs = songs; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public PlaylistDto build() {
            return new PlaylistDto(id, userId, title, description, coverUrl, isPublic, createdBy, songCount, songs, createdAt);
        }
    }

    public static PlaylistDto fromEntity(Playlist playlist) {
        if (playlist == null) return null;
        List<SongDto> songDtos = playlist.getSongs() != null
                ? playlist.getSongs().stream().map(SongDto::fromEntity).collect(Collectors.toList())
                : new ArrayList<>();

        return PlaylistDto.builder()
                .id(playlist.getId())
                .userId(playlist.getOwner() != null ? playlist.getOwner().getId() : null)
                .title(playlist.getTitle())
                .description(playlist.getDescription())
                .coverUrl(playlist.getCoverUrl())
                .isPublic(playlist.getIsPublic())
                .createdBy(playlist.getCreatedBy() != null ? playlist.getCreatedBy() :
                        (playlist.getOwner() != null ? playlist.getOwner().getUsername() : "TuneWave User"))
                .songCount(songDtos.size())
                .songs(songDtos)
                .createdAt(playlist.getCreatedAt())
                .build();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public Integer getSongCount() { return songCount; }
    public void setSongCount(Integer songCount) { this.songCount = songCount; }

    public List<SongDto> getSongs() { return songs; }
    public void setSongs(List<SongDto> songs) { this.songs = songs; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
