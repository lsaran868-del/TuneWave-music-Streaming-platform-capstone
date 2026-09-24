package com.tunewave.musicplayer.repository;

import com.tunewave.musicplayer.model.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlbumRepository extends JpaRepository<Album, String> {
    @Query("SELECT a FROM Album a WHERE a.artist.id = :artistId")
    List<Album> findByArtistId(@Param("artistId") String artistId);
}
