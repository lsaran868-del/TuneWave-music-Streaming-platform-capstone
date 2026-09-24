package com.tunewave.musicplayer.service;

import com.tunewave.musicplayer.dto.SongDto;
import com.tunewave.musicplayer.dto.UserProfileDto;
import com.tunewave.musicplayer.exception.BadRequestException;
import com.tunewave.musicplayer.exception.ResourceNotFoundException;
import com.tunewave.musicplayer.model.Song;
import com.tunewave.musicplayer.model.User;
import com.tunewave.musicplayer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SongService songService;

    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile(String userId) {
        User user = findUserEntityById(userId);
        return UserProfileDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public List<SongDto> getUserFavorites(String userId) {
        User user = findUserEntityById(userId);
        return user.getFavorites().stream()
                .map(SongDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void addSongToFavorites(String userId, String songId) {
        User user = findUserEntityById(userId);
        Song song = songService.findSongEntityById(songId);

        if (user.getFavorites().contains(song)) {
            throw new BadRequestException("Song is already in user favorites");
        }

        user.getFavorites().add(song);
        userRepository.save(user);
    }

    @Transactional
    public void removeSongFromFavorites(String userId, String songId) {
        User user = findUserEntityById(userId);
        Song song = songService.findSongEntityById(songId);

        user.getFavorites().remove(song);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User findUserEntityById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }

    @Transactional(readOnly = true)
    public User findUserEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
