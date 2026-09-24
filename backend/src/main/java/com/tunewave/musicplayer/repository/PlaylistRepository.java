package com.tunewave.musicplayer.repository;

import com.tunewave.musicplayer.model.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, String> {
    @Query("SELECT p FROM Playlist p WHERE p.owner.id = :ownerId")
    List<Playlist> findByOwnerId(@Param("ownerId") String ownerId);

    List<Playlist> findByIsPublicTrue();

    @Query("SELECT p FROM Playlist p WHERE p.id = :id AND p.owner.id = :ownerId")
    Optional<Playlist> findByIdAndOwnerId(@Param("id") String id, @Param("ownerId") String ownerId);

    @Query("SELECT p FROM Playlist p LEFT JOIN FETCH p.songs WHERE p.id = :id")
    Optional<Playlist> findByIdWithSongs(@Param("id") String id);
}
