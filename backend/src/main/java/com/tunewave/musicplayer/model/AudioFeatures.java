package com.tunewave.musicplayer.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class AudioFeatures {
    private Double tempo;        // BPM e.g., 120.0
    private Double energy;       // 0.0 to 1.0
    private Double valence;      // 0.0 to 1.0 (mood happiness)
    private Double danceability; // 0.0 to 1.0
    private Double acousticness; // 0.0 to 1.0

    public AudioFeatures() {}

    public AudioFeatures(Double tempo, Double energy, Double valence, Double danceability, Double acousticness) {
        this.tempo = tempo;
        this.energy = energy;
        this.valence = valence;
        this.danceability = danceability;
        this.acousticness = acousticness;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Double tempo;
        private Double energy;
        private Double valence;
        private Double danceability;
        private Double acousticness;

        public Builder tempo(Double tempo) { this.tempo = tempo; return this; }
        public Builder energy(Double energy) { this.energy = energy; return this; }
        public Builder valence(Double valence) { this.valence = valence; return this; }
        public Builder danceability(Double danceability) { this.danceability = danceability; return this; }
        public Builder acousticness(Double acousticness) { this.acousticness = acousticness; return this; }
        public AudioFeatures build() {
            return new AudioFeatures(tempo, energy, valence, danceability, acousticness);
        }
    }

    public Double getTempo() { return tempo; }
    public void setTempo(Double tempo) { this.tempo = tempo; }

    public Double getEnergy() { return energy; }
    public void setEnergy(Double energy) { this.energy = energy; }

    public Double getValence() { return valence; }
    public void setValence(Double valence) { this.valence = valence; }

    public Double getDanceability() { return danceability; }
    public void setDanceability(Double danceability) { this.danceability = danceability; }

    public Double getAcousticness() { return acousticness; }
    public void setAcousticness(Double acousticness) { this.acousticness = acousticness; }
}
