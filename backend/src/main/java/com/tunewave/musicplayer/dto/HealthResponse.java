package com.tunewave.musicplayer.dto;

public class HealthResponse {
    private String status;
    private String application;

    public HealthResponse() {}

    public HealthResponse(String status, String application) {
        this.status = status;
        this.application = application;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String status;
        private String application;

        public Builder status(String status) { this.status = status; return this; }
        public Builder application(String application) { this.application = application; return this; }
        public HealthResponse build() {
            return new HealthResponse(status, application);
        }
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getApplication() { return application; }
    public void setApplication(String application) { this.application = application; }
}
