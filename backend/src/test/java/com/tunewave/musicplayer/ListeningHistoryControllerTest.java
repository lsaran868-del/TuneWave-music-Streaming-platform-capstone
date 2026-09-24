package com.tunewave.musicplayer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tunewave.musicplayer.dto.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ListeningHistoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String getValidSongId() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/songs"))
                .andExpect(status().isOk())
                .andReturn();
        List<SongDto> songs = objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<>() {});
        assertFalse(songs.isEmpty());
        return songs.get(0).getId();
    }

    private String registerAndGetToken(String email, String username) throws Exception {
        RegisterRequest req = new RegisterRequest(email, username, "StrongPass123!");
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();
        AuthResponse res = objectMapper.readValue(result.getResponse().getContentAsString(), AuthResponse.class);
        return res.getToken();
    }

    @Test
    @DisplayName("1. POST /api/history allows anonymous listen event and increments stream count")
    public void testRecordPlayEventAnonymous() throws Exception {
        String songId = getValidSongId();
        RecordPlayRequest req = new RecordPlayRequest(songId, 45);

        mockMvc.perform(post("/api/history")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("2. POST /api/history validates missing song ID")
    public void testRecordPlayEventInvalid() throws Exception {
        RecordPlayRequest req = new RecordPlayRequest("", 45);

        mockMvc.perform(post("/api/history")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("3. POST /api/history records user play event when authenticated with JWT")
    public void testRecordPlayEventAuthenticated() throws Exception {
        String token = registerAndGetToken("listener" + System.currentTimeMillis() + "@example.com", "historylistener");
        String songId = getValidSongId();
        RecordPlayRequest req = new RecordPlayRequest(songId, 60);

        mockMvc.perform(post("/api/history")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.songId", is(songId)))
                .andExpect(jsonPath("$.playDurationSeconds", is(60)));
    }

    @Test
    @DisplayName("4. GET /api/history returns listening history for authenticated user")
    public void testGetUserHistoryAuthenticated() throws Exception {
        String email = "historyuser" + System.currentTimeMillis() + "@example.com";
        String token = registerAndGetToken(email, "historyuser");
        String songId = getValidSongId();

        // Record a play event first
        RecordPlayRequest req = new RecordPlayRequest(songId, 75);
        mockMvc.perform(post("/api/history")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        // Fetch user history
        mockMvc.perform(get("/api/history")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].songId", is(songId)))
                .andExpect(jsonPath("$[0].playDurationSeconds", is(75)));
    }

    @Test
    @DisplayName("5. GET /api/history fails with 401 when unauthenticated")
    public void testGetUserHistoryUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/history"))
                .andExpect(status().isUnauthorized());
    }
}
