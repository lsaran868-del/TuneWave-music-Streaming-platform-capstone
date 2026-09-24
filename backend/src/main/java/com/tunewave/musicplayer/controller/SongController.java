package com.tunewave.musicplayer.controller;

import com.tunewave.musicplayer.dto.SongDto;
import com.tunewave.musicplayer.service.SongService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping
    public ResponseEntity<List<SongDto>> getAllSongs() {
        return ResponseEntity.ok(songService.getAllSongs());
    }

    @GetMapping("/search")
    public ResponseEntity<List<SongDto>> searchSongs(@RequestParam(name = "q", required = false, defaultValue = "") String query) {
        return ResponseEntity.ok(songService.searchSongs(query));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<SongDto>> getTrendingSongs() {
        return ResponseEntity.ok(songService.getTrendingSongs());
    }

    @GetMapping("/recently-added")
    public ResponseEntity<List<SongDto>> getRecentlyAddedSongs() {
        return ResponseEntity.ok(songService.getRecentlyAddedSongs());
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<SongDto>> getSongsByGenre(@PathVariable("genre") String genre) {
        return ResponseEntity.ok(songService.getSongsByGenre(genre));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SongDto> getSongById(@PathVariable("id") String id) {
        return ResponseEntity.ok(songService.getSongById(id));
    }

    @PostMapping("/{id}/stream")
    public ResponseEntity<SongDto> incrementStreamCount(@PathVariable("id") String id) {
        return ResponseEntity.ok(songService.incrementStreamCount(id));
    }
}
