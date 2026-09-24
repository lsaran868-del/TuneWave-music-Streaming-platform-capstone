package com.tunewave.musicplayer.repository;

import com.tunewave.musicplayer.model.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, String> {
    Optional<Artist> findByNameIgnoreCase(String name);
}
