package com.tunewave.musicplayer.dto;

import com.tunewave.musicplayer.model.AudioFeatures;
import com.tunewave.musicplayer.model.Song;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    private AudioFeatures features;
    private Long streamCount;
    private LocalDateTime createdAt;

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
                .features(song.getFeatures())
                .streamCount(song.getStreamCount())
                .createdAt(song.getCreatedAt())
                .build();
    }
}
