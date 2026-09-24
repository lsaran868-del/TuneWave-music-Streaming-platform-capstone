package com.tunewave.musicplayer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tunewave.musicplayer.dto.SongDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
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
public class SongControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("1. GET /api/songs returns full music catalog with all required song attributes")
    public void testGetAllSongs() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/songs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].id", not(emptyOrNullString())))
                .andExpect(jsonPath("$[0].title", not(emptyOrNullString())))
                .andExpect(jsonPath("$[0].artist", not(emptyOrNullString())))
                .andExpect(jsonPath("$[0].album", not(emptyOrNullString())))
                .andExpect(jsonPath("$[0].genre", not(emptyOrNullString())))
                .andExpect(jsonPath("$[0].duration", greaterThan(0)))
                .andExpect(jsonPath("$[0].audioUrl", not(emptyOrNullString())))
                .andExpect(jsonPath("$[0].coverUrl", not(emptyOrNullString())))
                .andExpect(jsonPath("$[0].streamCount", notNullValue()))
                .andExpect(jsonPath("$[0].audioFeatures", notNullValue()))
                .andExpect(jsonPath("$[0].audioFeatures.tempo", greaterThan(0.0)))
                .andReturn();

        List<SongDto> songs = objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<>() {});
        assertFalse(songs.isEmpty());
    }

    @Test
    @DisplayName("2. GET /api/songs/{id} returns song for valid ID")
    public void testGetSongByIdSuccess() throws Exception {
        // First get all songs to retrieve a valid ID
        MvcResult listResult = mockMvc.perform(get("/api/songs"))
                .andExpect(status().isOk())
                .andReturn();

        List<SongDto> songs = objectMapper.readValue(listResult.getResponse().getContentAsString(), new TypeReference<>() {});
        assertFalse(songs.isEmpty());

        String validId = songs.get(0).getId();

        mockMvc.perform(get("/api/songs/" + validId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(validId))
                .andExpect(jsonPath("$.title").value(songs.get(0).getTitle()));
    }

    @Test
    @DisplayName("3. GET /api/songs/{id} returns 404 for invalid ID")
    public void testGetSongByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/songs/non-existent-song-id-999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message", containsString("Song not found with ID: non-existent-song-id-999")));
    }

    @Test
    @DisplayName("4. GET /api/songs/search matches title, artist, album, and genre case-insensitively")
    public void testSearchSongs() throws Exception {
        // Search by title (lowercase)
        mockMvc.perform(get("/api/songs/search").param("q", "cyberpunk"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].title", containsStringIgnoringCase("Cyberpunk")));

        // Search by artist (uppercase)
        mockMvc.perform(get("/api/songs/search").param("q", "SYNTHWAVE PULSE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].artist", containsStringIgnoringCase("SynthWave Pulse")));

        // Search by album
        mockMvc.perform(get("/api/songs/search").param("q", "Coffee & Code"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].album", containsStringIgnoringCase("Coffee & Code")));
    }

    @Test
    @DisplayName("5. GET /api/songs/search returns empty list for non-matching query")
    public void testSearchEmptyResults() throws Exception {
        mockMvc.perform(get("/api/songs/search").param("q", "XYZ999NonExistentSongQuery404"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("6. GET /api/songs/genre/{genre} filters songs by genre case-insensitively")
    public void testGetSongsByGenre() throws Exception {
        mockMvc.perform(get("/api/songs/genre/synthwave"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].genre", equalToIgnoringCase("Synthwave")));

        // Unknown genre returns empty list
        mockMvc.perform(get("/api/songs/genre/PolkaNonExistentGenre"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("7. GET /api/songs/trending returns songs sorted by stream count descending")
    public void testGetTrendingSongs() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/songs/trending"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))))
                .andReturn();

        List<SongDto> trending = objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<>() {});
        for (int i = 0; i < trending.size() - 1; i++) {
            assertTrue(trending.get(i).getStreamCount() >= trending.get(i + 1).getStreamCount(),
                    "Trending songs must be strictly sorted by stream count descending");
        }
    }

    @Test
    @DisplayName("8. GET /api/songs/recently-added returns songs ordered by creation date")
    public void testGetRecentlyAddedSongs() throws Exception {
        mockMvc.perform(get("/api/songs/recently-added"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("9. POST /api/songs/{id}/stream increments stream count")
    public void testIncrementStreamCount() throws Exception {
        MvcResult listResult = mockMvc.perform(get("/api/songs"))
                .andExpect(status().isOk())
                .andReturn();

        List<SongDto> songs = objectMapper.readValue(listResult.getResponse().getContentAsString(), new TypeReference<>() {});
        SongDto song = songs.get(0);

        MvcResult songResult = mockMvc.perform(get("/api/songs/" + song.getId()))
                .andExpect(status().isOk())
                .andReturn();
        SongDto freshSong = objectMapper.readValue(songResult.getResponse().getContentAsString(), SongDto.class);
        long initialStreams = freshSong.getStreamCount();

        mockMvc.perform(post("/api/songs/" + song.getId() + "/stream"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.streamCount").value(initialStreams + 1));
    }
}
