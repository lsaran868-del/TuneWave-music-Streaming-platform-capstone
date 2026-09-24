package com.tunewave.musicplayer.repository;

import com.tunewave.musicplayer.model.ListeningHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ListeningHistoryRepository extends JpaRepository<ListeningHistory, String> {
    @Query("SELECT lh FROM ListeningHistory lh WHERE lh.user.id = :userId ORDER BY lh.playedAt DESC")
    List<ListeningHistory> findTop50ByUserIdOrderByPlayedAtDesc(@Param("userId") String userId);
}
