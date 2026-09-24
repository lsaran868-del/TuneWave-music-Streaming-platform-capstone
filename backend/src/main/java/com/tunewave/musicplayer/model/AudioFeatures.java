package com.tunewave.musicplayer.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AudioFeatures {
    private Double tempo;        // BPM e.g., 120.0
    private Double energy;       // 0.0 to 1.0
    private Double valence;      // 0.0 to 1.0 (mood happiness)
    private Double danceability; // 0.0 to 1.0
    private Double acousticness; // 0.0 to 1.0
}
