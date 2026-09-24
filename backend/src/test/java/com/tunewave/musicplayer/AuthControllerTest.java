package com.tunewave.musicplayer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tunewave.musicplayer.dto.AuthRequest;
import com.tunewave.musicplayer.dto.AuthResponse;
import com.tunewave.musicplayer.dto.RegisterRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static String validJwtToken;

    @Test
    @Order(1)
    @DisplayName("1. Register new user successfully")
    public void testRegisterSuccess() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("testuser@tunewave.io", "securePassword123", "TestUser");

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.token", not(emptyOrNullString())))
                .andExpect(jsonPath("$.token", not(containsString("demo-jwt-token"))))
                .andExpect(jsonPath("$.user.email").value("testuser@tunewave.io"))
                .andExpect(jsonPath("$.user.username").value("TestUser"))
                .andExpect(jsonPath("$.user.password").doesNotExist())
                .andExpect(jsonPath("$.user.passwordHash").doesNotExist())
                .andReturn();

        AuthResponse authResponse = objectMapper.readValue(result.getResponse().getContentAsString(), AuthResponse.class);
        validJwtToken = authResponse.getToken();
    }

    @Test
    @Order(2)
    @DisplayName("2. Reject registration with duplicate email")
    public void testRegisterDuplicateEmail() throws Exception {
        RegisterRequest duplicateRequest = new RegisterRequest("testuser@tunewave.io", "anotherPassword456", "AnotherUser");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("already registered")));
    }

    @Test
    @Order(3)
    @DisplayName("3. Login successfully with correct credentials")
    public void testLoginSuccess() throws Exception {
        AuthRequest loginRequest = new AuthRequest("testuser@tunewave.io", "securePassword123");

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.token", not(emptyOrNullString())))
                .andExpect(jsonPath("$.user.email").value("testuser@tunewave.io"))
                .andExpect(jsonPath("$.user.password").doesNotExist())
                .andExpect(jsonPath("$.user.passwordHash").doesNotExist())
                .andReturn();

        AuthResponse authResponse = objectMapper.readValue(result.getResponse().getContentAsString(), AuthResponse.class);
        validJwtToken = authResponse.getToken();
    }

    @Test
    @Order(4)
    @DisplayName("4. Reject login with invalid password")
    public void testLoginInvalidPassword() throws Exception {
        AuthRequest invalidLogin = new AuthRequest("testuser@tunewave.io", "wrongPassword999");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidLogin)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Invalid email or password")));
    }

    @Test
    @Order(5)
    @DisplayName("5. Fetch current user profile via GET /api/auth/me with valid JWT")
    public void testGetMeSuccess() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + validJwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("testuser@tunewave.io"))
                .andExpect(jsonPath("$.username").value("TestUser"))
                .andExpect(jsonPath("$.password").doesNotExist())
                .andExpect(jsonPath("$.passwordHash").doesNotExist());
    }

    @Test
    @Order(6)
    @DisplayName("6. Reject unauthorized request to /api/auth/me without token")
    public void testGetMeUnauthorized() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @Order(7)
    @DisplayName("7. Reject request with expired or invalid token")
    public void testInvalidToken() throws Exception {
        String invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidPayload.fakeSignature";

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + invalidToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @Order(8)
    @DisplayName("8. Health endpoint is public")
    public void testHealthIsPublic() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.application").value("TuneWave"));
    }
}
