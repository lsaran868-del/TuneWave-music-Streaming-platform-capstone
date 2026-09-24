package com.tunewave.musicplayer.dto;

import com.tunewave.musicplayer.model.Artist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArtistDto {
    private String id;
    private String name;
    private String bio;
    private String imageUrl;
    private String genres;
    private Integer songCount;
    private Integer albumCount;

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
}
