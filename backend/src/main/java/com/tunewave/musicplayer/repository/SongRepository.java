package com.tunewave.musicplayer.repository;

import com.tunewave.musicplayer.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, String> {
    List<Song> findByGenreIgnoreCase(String genre);
    
    @Query("SELECT s FROM Song s WHERE " +
           "LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.artistName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "(s.artist IS NOT NULL AND LOWER(s.artist.name) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
           "LOWER(s.genre) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Song> searchSongs(String query);

    List<Song> findTop10ByOrderByStreamCountDesc();

    List<Song> findTop20ByOrderByStreamCountDesc();
}
