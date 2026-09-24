package com.tunewave.musicplayer.dto;

import com.tunewave.musicplayer.model.Album;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlbumDto {
    private String id;
    private String title;
    private String coverUrl;
    private Integer releaseYear;
    private String artistId;
    private String artistName;
    private Integer trackCount;

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
}
