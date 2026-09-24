package com.tunewave.musicplayer.dto;

import com.tunewave.musicplayer.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDto {
    private String id;
    private String email;
    private String username;
    private String avatarUrl;
    private String bio;
    private String plan;
    private Double totalHoursListened;
    private Integer playlistCount;
    private Integer favoriteCount;
    private LocalDateTime createdAt;

    public static UserProfileDto fromEntity(User user) {
        if (user == null) return null;
        return UserProfileDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .plan(user.getPlan())
                .totalHoursListened(user.getTotalHoursListened())
                .playlistCount(user.getPlaylists() != null ? user.getPlaylists().size() : 0)
                .favoriteCount(user.getFavorites() != null ? user.getFavorites().size() : 0)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
