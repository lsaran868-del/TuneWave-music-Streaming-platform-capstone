package com.tunewave.musicplayer.dto;

public class AuthResponse {
    private String token;
    private UserDto user;

    public AuthResponse() {}

    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private UserDto user;

        public Builder token(String token) { this.token = token; return this; }
        public Builder user(UserDto user) { this.user = user; return this; }
        public AuthResponse build() {
            return new AuthResponse(token, user);
        }
    }

    public static class UserDto {
        private String id;
        private String email;
        private String username;
        private String avatarUrl;
        private String plan;
        private Double totalHoursListened;
        private String role;

        public UserDto() {}

        public UserDto(String id, String email, String username, String avatarUrl) {
            this(id, email, username, avatarUrl, "FREE", 0.0, "ROLE_USER");
        }

        public UserDto(String id, String email, String username, String avatarUrl, String plan, Double totalHoursListened, String role) {
            this.id = id;
            this.email = email;
            this.username = username;
            this.avatarUrl = avatarUrl;
            this.plan = plan != null ? plan : "FREE";
            this.totalHoursListened = totalHoursListened != null ? totalHoursListened : 0.0;
            this.role = role != null ? role : "ROLE_USER";
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private String id;
            private String email;
            private String username;
            private String avatarUrl;
            private String plan = "FREE";
            private Double totalHoursListened = 0.0;
            private String role = "ROLE_USER";

            public Builder id(String id) { this.id = id; return this; }
            public Builder email(String email) { this.email = email; return this; }
            public Builder username(String username) { this.username = username; return this; }
            public Builder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
            public Builder plan(String plan) { this.plan = plan; return this; }
            public Builder totalHoursListened(Double totalHoursListened) { this.totalHoursListened = totalHoursListened; return this; }
            public Builder role(String role) { this.role = role; return this; }
            public UserDto build() {
                return new UserDto(id, email, username, avatarUrl, plan, totalHoursListened, role);
            }
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

        public String getPlan() { return plan; }
        public void setPlan(String plan) { this.plan = plan; }

        public Double getTotalHoursListened() { return totalHoursListened; }
        public void setTotalHoursListened(Double totalHoursListened) { this.totalHoursListened = totalHoursListened; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}
