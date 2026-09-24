package com.tunewave.musicplayer.service;

import com.tunewave.musicplayer.dto.SongDto;
import com.tunewave.musicplayer.exception.ResourceNotFoundException;
import com.tunewave.musicplayer.model.Song;
import com.tunewave.musicplayer.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "songs", key = "'all'")
    public List<SongDto> getAllSongs() {
        return songRepository.findAll().stream()
                .map(SongDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "songs", key = "#id")
    public SongDto getSongById(String id) {
        Song song = findSongEntityById(id);
        return SongDto.fromEntity(song);
    }

    @Transactional(readOnly = true)
    public List<SongDto> searchSongs(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllSongs();
        }
        return songRepository.searchSongs(query.trim()).stream()
                .map(SongDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SongDto> getSongsByGenre(String genre) {
        return songRepository.findByGenreIgnoreCase(genre).stream()
                .map(SongDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SongDto> getTrendingSongs() {
        return songRepository.findTop10ByOrderByStreamCountDesc().stream()
                .map(SongDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = "songs", key = "#id")
    public SongDto incrementStreamCount(String id) {
        Song song = findSongEntityById(id);
        song.setStreamCount(song.getStreamCount() + 1);
        Song saved = songRepository.save(song);
        return SongDto.fromEntity(saved);
    }

    @Transactional
    @CacheEvict(value = "songs", allEntries = true)
    public SongDto createSong(Song song) {
        Song saved = songRepository.save(song);
        return SongDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public Song findSongEntityById(String id) {
        return songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with ID: " + id));
    }
}
