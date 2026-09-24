package com.tunewave.musicplayer.dto;

import com.tunewave.musicplayer.model.Playlist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaylistDto {
    private String id;
    private String userId;
    private String title;
    private String description;
    private String coverUrl;
    private Boolean isPublic;
    private String createdBy;
    private Integer songCount;
    @Builder.Default
    private List<SongDto> songs = new ArrayList<>();
    private LocalDateTime createdAt;

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
}
