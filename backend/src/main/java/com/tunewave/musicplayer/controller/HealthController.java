package com.tunewave.musicplayer.controller;

import com.tunewave.musicplayer.dto.HealthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> healthCheck() {
        return ResponseEntity.ok(HealthResponse.builder()
                .status("UP")
                .application("TuneWave")
                .build());
    }
}
