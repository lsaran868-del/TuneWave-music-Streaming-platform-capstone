package com.tunewave.musicplayer.dto;

public class RecordPlayRequest {
    private String songId;
    private Integer playDurationSeconds;

    public RecordPlayRequest() {}

    public RecordPlayRequest(String songId, Integer playDurationSeconds) {
        this.songId = songId;
        this.playDurationSeconds = playDurationSeconds;
    }

    public String getSongId() {
        return songId;
    }

    public void setSongId(String songId) {
        this.songId = songId;
    }

    public Integer getPlayDurationSeconds() {
        return playDurationSeconds;
    }

    public void setPlayDurationSeconds(Integer playDurationSeconds) {
        this.playDurationSeconds = playDurationSeconds;
    }
}
