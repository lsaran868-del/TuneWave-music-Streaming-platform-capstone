package com.tunewave.musicplayer.repository;

import com.tunewave.musicplayer.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, String> {

    List<Song> findByGenreIgnoreCase(String genre);

    @Query("SELECT s FROM Song s " +
           "LEFT JOIN s.artist a " +
           "LEFT JOIN s.album al WHERE " +
           "LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "(s.artistName IS NOT NULL AND LOWER(s.artistName) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
           "(a.name IS NOT NULL AND LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
           "(s.albumTitle IS NOT NULL AND LOWER(s.albumTitle) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
           "(al.title IS NOT NULL AND LOWER(al.title) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
           "(s.genre IS NOT NULL AND LOWER(s.genre) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Song> searchSongs(@Param("query") String query);

    List<Song> findTop20ByOrderByStreamCountDesc();

    List<Song> findTop20ByOrderByCreatedAtDesc();
}
