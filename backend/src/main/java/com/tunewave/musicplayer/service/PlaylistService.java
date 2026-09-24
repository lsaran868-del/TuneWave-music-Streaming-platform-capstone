package com.tunewave.musicplayer.service;

import com.tunewave.musicplayer.dto.PlaylistDto;
import com.tunewave.musicplayer.exception.BadRequestException;
import com.tunewave.musicplayer.exception.ResourceNotFoundException;
import com.tunewave.musicplayer.model.Playlist;
import com.tunewave.musicplayer.model.Song;
import com.tunewave.musicplayer.model.User;
import com.tunewave.musicplayer.repository.PlaylistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final UserService userService;
    private final SongService songService;

    @Transactional(readOnly = true)
    public List<PlaylistDto> getAllPublicPlaylists() {
        return playlistRepository.findByIsPublicTrue().stream()
                .map(PlaylistDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PlaylistDto> getPlaylistsByUserId(String userId) {
        return playlistRepository.findByOwnerId(userId).stream()
                .map(PlaylistDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlaylistDto getPlaylistById(String id) {
        Playlist playlist = playlistRepository.findByIdWithSongs(id)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found with ID: " + id));
        return PlaylistDto.fromEntity(playlist);
    }

    @Transactional
    public PlaylistDto createPlaylist(String userId, String title, String description, String coverUrl, Boolean isPublic, List<String> songIds) {
        if (title == null || title.trim().isEmpty()) {
            throw new BadRequestException("Playlist title is required");
        }

        User owner = userService.findUserEntityById(userId);

        List<Song> songs = new ArrayList<>();
        if (songIds != null && !songIds.isEmpty()) {
            for (String songId : songIds) {
                try {
                    songs.add(songService.findSongEntityById(songId));
                } catch (ResourceNotFoundException ignored) {
                    // skip non-existent song ids
                }
            }
        }

        Playlist playlist = Playlist.builder()
                .owner(owner)
                .title(title.trim())
                .description(description)
                .coverUrl(coverUrl != null && !coverUrl.isBlank() ? coverUrl : "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80")
                .isPublic(isPublic != null ? isPublic : true)
                .createdBy(owner.getUsername())
                .songs(songs)
                .build();

        Playlist saved = playlistRepository.save(playlist);
        return PlaylistDto.fromEntity(saved);
    }

    @Transactional
    public PlaylistDto addSongToPlaylist(String playlistId, String songId, String userId) {
        Playlist playlist = findPlaylistEntityByIdAndOwner(playlistId, userId);
        Song song = songService.findSongEntityById(songId);

        if (!playlist.getSongs().contains(song)) {
            playlist.getSongs().add(song);
            playlist = playlistRepository.save(playlist);
        }

        return PlaylistDto.fromEntity(playlist);
    }

    @Transactional
    public PlaylistDto removeSongFromPlaylist(String playlistId, String songId, String userId) {
        Playlist playlist = findPlaylistEntityByIdAndOwner(playlistId, userId);
        Song song = songService.findSongEntityById(songId);

        playlist.getSongs().remove(song);
        Playlist saved = playlistRepository.save(playlist);
        return PlaylistDto.fromEntity(saved);
    }

    @Transactional
    public void deletePlaylist(String playlistId, String userId) {
        Playlist playlist = findPlaylistEntityByIdAndOwner(playlistId, userId);
        playlistRepository.delete(playlist);
    }

    private Playlist findPlaylistEntityByIdAndOwner(String playlistId, String userId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found with ID: " + playlistId));

        if (!playlist.getOwner().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized: You do not own this playlist");
        }

        return playlist;
    }
}
