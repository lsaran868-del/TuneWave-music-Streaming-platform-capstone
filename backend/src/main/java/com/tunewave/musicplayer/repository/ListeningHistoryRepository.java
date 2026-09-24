package com.tunewave.musicplayer.repository;

import com.tunewave.musicplayer.model.ListeningHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ListeningHistoryRepository extends JpaRepository<ListeningHistory, String> {
    List<ListeningHistory> findTop50ByUserIdOrderByPlayedAtDesc(String userId);
}
