package com.tunewave.musicplayer.service;

import com.tunewave.musicplayer.dto.AuthRequest;
import com.tunewave.musicplayer.dto.AuthResponse;
import com.tunewave.musicplayer.dto.RegisterRequest;
import com.tunewave.musicplayer.dto.UserProfileDto;
import com.tunewave.musicplayer.exception.BadRequestException;
import com.tunewave.musicplayer.exception.ResourceNotFoundException;
import com.tunewave.musicplayer.model.User;
import com.tunewave.musicplayer.repository.UserRepository;
import com.tunewave.musicplayer.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BadRequestException("Email is required");
        }
        if (!request.getEmail().contains("@")) {
            throw new BadRequestException("Invalid email format");
        }
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new BadRequestException("Username is required");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters long");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("Email is already registered: " + normalizedEmail);
        }

        // Never store plain-text password - use BCryptPasswordEncoder
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .email(normalizedEmail)
                .username(request.getUsername().trim())
                .passwordHash(encodedPassword)
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80")
                .plan("FREE")
                .totalHoursListened(0.0)
                .role("ROLE_USER")
                .build();

        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getId(), user.getRole());

        AuthResponse.UserDto userDto = AuthResponse.UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .avatarUrl(user.getAvatarUrl())
                .plan(user.getPlan())
                .totalHoursListened(user.getTotalHoursListened())
                .role(user.getRole())
                .build();

        return new AuthResponse(token, userDto);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BadRequestException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password is required");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new BadRequestException("Invalid email or password");
        } catch (Exception e) {
            throw new BadRequestException("Authentication failed: " + e.getMessage());
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + normalizedEmail));

        String token = jwtService.generateToken(user.getEmail(), user.getId(), user.getRole());

        AuthResponse.UserDto userDto = AuthResponse.UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .avatarUrl(user.getAvatarUrl())
                .plan(user.getPlan())
                .totalHoursListened(user.getTotalHoursListened())
                .role(user.getRole())
                .build();

        return new AuthResponse(token, userDto);
    }

    @Transactional(readOnly = true)
    public UserProfileDto getCurrentUserProfile(String email) {
        if (email == null || email.isBlank()) {
            throw new BadRequestException("Authenticated user email not provided");
        }
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserProfileDto.fromEntity(user);
    }
}
