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

        public UserDto() {}

        public UserDto(String id, String email, String username, String avatarUrl) {
            this.id = id;
            this.email = email;
            this.username = username;
            this.avatarUrl = avatarUrl;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private String id;
            private String email;
            private String username;
            private String avatarUrl;

            public Builder id(String id) { this.id = id; return this; }
            public Builder email(String email) { this.email = email; return this; }
            public Builder username(String username) { this.username = username; return this; }
            public Builder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
            public UserDto build() {
                return new UserDto(id, email, username, avatarUrl);
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
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}
