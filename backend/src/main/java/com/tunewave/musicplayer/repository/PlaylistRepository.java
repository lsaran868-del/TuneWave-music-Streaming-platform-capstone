package com.tunewave.musicplayer.repository;

import com.tunewave.musicplayer.model.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, String> {
    List<Playlist> findByOwnerId(String ownerId);
    List<Playlist> findByIsPublicTrue();
    Optional<Playlist> findByIdAndOwnerId(String id, String ownerId);

    @Query("SELECT p FROM Playlist p LEFT JOIN FETCH p.songs WHERE p.id = :id")
    Optional<Playlist> findByIdWithSongs(String id);
}
