package com.tunewave.musicplayer.controller;

import com.tunewave.musicplayer.dto.ListeningHistoryDto;
import com.tunewave.musicplayer.dto.RecordPlayRequest;
import com.tunewave.musicplayer.model.User;
import com.tunewave.musicplayer.service.ListeningHistoryService;
import com.tunewave.musicplayer.service.SongService;
import com.tunewave.musicplayer.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/history")
public class ListeningHistoryController {

    private final ListeningHistoryService historyService;
    private final UserService userService;
    private final SongService songService;

    public ListeningHistoryController(ListeningHistoryService historyService, UserService userService, SongService songService) {
        this.historyService = historyService;
        this.userService = userService;
        this.songService = songService;
    }

    @PostMapping
    public ResponseEntity<?> recordPlayEvent(@RequestBody RecordPlayRequest request, Authentication authentication) {
        if (request == null || request.getSongId() == null || request.getSongId().isBlank()) {
            return ResponseEntity.badRequest().body("Song ID is required");
        }

        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            String email = authentication.getName();
            User user = userService.findUserEntityByEmail(email);
            ListeningHistoryDto dto = historyService.recordPlayEvent(user.getId(), request.getSongId(), request.getPlayDurationSeconds());
            return ResponseEntity.ok(dto);
        } else {
            // Anonymous play - still register legitimate stream count increment
            songService.incrementStreamCount(request.getSongId());
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<ListeningHistoryDto>> getUserHistory(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        String email = authentication.getName();
        User user = userService.findUserEntityByEmail(email);
        return ResponseEntity.ok(historyService.getUserHistory(user.getId()));
    }
}
