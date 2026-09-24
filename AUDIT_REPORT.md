# PlayX Music Streaming Platform — System Audit Report (Phase 0)

> **Document Type:** Phase 0 Architecture, Codebase & Readiness Audit  
> **Target System:** PlayX Music Player (Full-Stack Audio Streaming & AI Discovery Platform)  
> **Stack:** Java 17 / 25, Spring Boot 3.2.0, Spring Data JPA, Spring Security, PostgreSQL/Supabase, React 18, Vite  
> **Audit Status:** Complete — Read-Only Inspection (No business logic or source code altered)

---

## 1. Current Architecture

PlayX is organized as a decoupled, full-stack client-server application:

```
PlayX music player/
├── backend/                  # Java 17/25 Spring Boot 3.2 REST API
│   ├── src/main/java/        # Domain models, repositories, DTOs
│   ├── src/main/resources/   # application.yml
│   ├── pom.xml               # Maven configuration
│   └── mvnw, mvnw.cmd        # Maven wrapper
├── frontend/                 # React 18 + Vite SPA
│   ├── src/                  # Components, contexts, pages, services, data
│   ├── package.json          # Dependencies & scripts
│   └── vite.config.js        # Dev server & reverse proxy configuration
└── .vscode/                  # Workspace configuration
```

### Architectural Characteristics:
- **Client Architecture:** A React 18 Single-Page Application (SPA) structured around React Context for global state (`AudioContext` for HTML5 Audio playback, Web Audio API frequency analysis, queues, and history; `AuthContext` for user session and backend connectivity detection). Page navigation is routed via internal state in `App.jsx`.
- **Audio & Signal Processing:** Real-time audio playback using the HTML5 `Audio` element coupled with the Web Audio API (`AudioContext`, `AnalyserNode` with `fftSize=64`) feeding a 60 FPS HTML5 `<canvas>` frequency visualizer.
- **Client-Side AI Engine:** Recommendation algorithms (cosine similarity vector calculation across 5 normalized dimensions, natural language prompt parsing, preference clustering) are implemented directly in JavaScript on the frontend.
- **Backend Architecture:** A Spring Boot 3.2.0 application intended to provide RESTful endpoints for user authentication (JWT), song catalogs, playlist persistence, listening history logging, and audio feature queries backed by PostgreSQL / Supabase.
- **State Decoupling / Fallback Strategy:** The frontend is resiliently decoupled from the backend; when backend REST endpoints are unreachable, the UI gracefully falls back to in-memory mock datasets (`INITIAL_SONGS`, `INITIAL_PLAYLISTS`) and mock authentication.

---

## 2. Backend Components That Already Exist

The backend currently consists of scaffolding for domain persistence and DTOs:

| Category | Component | Description |
| :--- | :--- | :--- |
| **Application** | `MusicPlayerApplication.java` | Spring Boot main entry point with `@SpringBootApplication` and `@EnableCaching`. |
| **DTOs** | `AuthRequest.java` | Login payload (`email`, `password`) with Lombok annotations. |
| | `AuthResponse.java` | Login/register response containing JWT `token` and nested `UserDto` (`id`, `email`, `username`, `avatarUrl`). |
| | `RegisterRequest.java` | Registration payload (`email`, `password`, `username`). |
| **Embeddables** | `AudioFeatures.java` | JPA `@Embeddable` vector features (`tempo`, `energy`, `valence`, `danceability`, `acousticness`). |
| **Entities** | `Song.java` | Song catalog entity with embedded `AudioFeatures`, stream count, metadata. |
| | `Playlist.java` | Playlist entity with eager element collection of song IDs. |
| | `ListeningHistory.java` | Play event entity with UUID generation, user/song IDs, duration, timestamp. |
| | `User.java` | User account entity with email uniqueness, password hash, role, avatar. |
| **Repositories** | `SongRepository.java` | Spring Data JPA repository with custom JPQL search and stream count ranking. |
| | `PlaylistRepository.java` | Spring Data JPA repository for user and public playlist filtering. |
| | `ListeningHistoryRepository.java`| Spring Data JPA repository querying top 50 user play events. |
| | `UserRepository.java` | Spring Data JPA repository with email lookup and existence checking. |
| **Config / Build** | `application.yml` | Port 8080 configuration, datasource, JPA, Caffeine cache spec, JWT secrets, Supabase placeholders. |
| | `pom.xml` | Dependencies: Spring Web, Security, Data JPA, PostgreSQL, Caffeine Cache, JJWT 0.11.5, Lombok, Starter Test. |

---

## 3. Frontend Components That Already Exist

The frontend is a fully realized, functional user interface with the following structure:

### Pages (`frontend/src/pages/`)
1. **`Home.jsx`**: Features weekly highlight track, personalized "Recommended for You" carousel, trending curated playlists, and quick-stream triggers.
2. **`AIDiscovery.jsx`**: Natural language prompt input with preset prompts, 5-parameter audio feature sliders (tempo, energy, valence, danceability, acousticness), similarity radar view, and "Save as Playlist" capabilities.
3. **`Search.jsx`**: Live multi-field search filtering against title, artist, genre, and interactive genre exploration tiles.
4. **`Library.jsx`**: Tabbed library displaying Liked Songs, User Custom Playlists, and Recent Listening History.
5. **`PlaylistDetail.jsx`**: Hero banner with dynamic playlist art, metadata, track list table with duration, track play/remove actions.
6. **`Profile.jsx`**: User profile card, listening time metrics, total liked count, subscription tier badge, sign-out control.

### Contexts (`frontend/src/context/`)
1. **`AudioContext.jsx`**: Global audio engine managing HTML5 Audio element, play/pause, track navigation, shuffle, repeat (off/all/one), volume/mute, active queue, liked song set, listening history tracking, and Web Audio API `AnalyserNode` graph.
2. **`AuthContext.jsx`**: User session lifecycle, JWT storage in `localStorage`, login/register modals, and periodic backend connectivity detection.

### UI Components (`frontend/src/components/`)
1. **`Navbar.jsx`**: Top navigation with search input, active tab indicator, live backend health status indicator ("LIVE API" vs "DEMO MODE"), and user avatar.
2. **`Sidebar.jsx`**: Navigation menu, library links, user playlists, and "Create Playlist" shortcut.
3. **`PlayerBar.jsx`**: Persistent bottom playback bar with track artwork, scrub bar with drag seek, play/pause/skip, volume slider, mute toggle, mini audio visualizer canvas, queue toggle, and full-screen expand button.
4. **`AudioVisualizer.jsx`**: Real-time canvas frequency bar spectrum analyzer utilizing Web Audio API.
5. **`SongCard.jsx`**: Track tile with hover-play overlay, genre badge, stream count, favorite heart toggle, and playlist add button.
6. **`PlaylistCard.jsx`**: Playlist tile with play-all trigger and track count.
7. **`QueueDrawer.jsx`**: Slide-over panel displaying the active playback queue with reorder/remove controls.
8. **`ExpandedPlayerModal.jsx`**: Full-screen modal player with vinyl art, audio features radar display, synchronized lyrics tab, and queue management.
9. **`CreatePlaylistModal.jsx`**: Modal dialogue for creating new playlists with title, description, and cover image URL.
10. **`AuthModal.jsx`**: Tabbed modal for user sign-in and account registration.

### Services & Utilities (`frontend/src/services/` & `data/`)
1. **`api.js`**: Centralized HTTP client using `fetch` with JWT header injection and fallback handlers.
2. **`recommendationEngine.js`**: Vector mathematical engine (cosine similarity, prompt keyword parsing, user history preference clustering).
3. **`supabase.js`**: Supabase client initialization and storage bucket URL generator.
4. **`initialSongs.js`**: Seed dataset of 12 complete songs with audio feature vectors, working Pixabay audio URLs, Unsplash album artwork, 3 playlists, and 8 genre presets.
5. **`index.css`**: Design system tokens (glassmorphism, Spotify-inspired dark aesthetic, CSS variables, keyframe animations).

---

## 4. Database Models

The JPA models represent the core music platform domain:

### `User` (`users` table)
- `id` (`String`): Primary Key, `@GeneratedValue(strategy = GenerationType.UUID)`
- `email` (`String`): Unique, non-null
- `passwordHash` (`String`): Non-null
- `username` (`String`): Non-null
- `avatarUrl` (`String`): Nullable
- `role` (`String`): Default `"ROLE_USER"`
- `createdAt` (`LocalDateTime`): Default `LocalDateTime.now()`

### `Song` (`songs` table)
- `id` (`String`): Primary Key (assigned manually; **no `@GeneratedValue`**)
- `title` (`String`): Non-null
- `artist` (`String`): Non-null
- `album` (`String`): Nullable
- `duration` (`Integer`): Duration in seconds
- `audioUrl` (`String`): Non-null streaming URL
- `coverUrl` (`String`): Nullable image URL
- `genre` (`String`): Nullable
- `mood` (`String`): Nullable
- `features` (`AudioFeatures`): `@Embedded` composite object
- `streamCount` (`Long`): Default `0L`
- `createdAt` (`LocalDateTime`): Default `LocalDateTime.now()`

### `AudioFeatures` (`@Embeddable` within `songs`)
- `tempo` (`Double`): BPM (e.g. 120.0)
- `energy` (`Double`): 0.0 to 1.0
- `valence` (`Double`): 0.0 to 1.0 (musical positivity)
- `danceability` (`Double`): 0.0 to 1.0
- `acousticness` (`Double`): 0.0 to 1.0

### `Playlist` (`playlists` table)
- `id` (`String`): Primary Key (assigned manually; **no `@GeneratedValue`**)
- `userId` (`String`): Non-null owner reference
- `title` (`String`): Non-null
- `description` (`String`): Nullable
- `coverUrl` (`String`): Nullable
- `isPublic` (`Boolean`): Default `true`
- `songIds` (`List<String>`): `@ElementCollection(fetch = FetchType.EAGER)`, joined via `playlist_songs` (`song_id`)
- `createdBy` (`String`): Display name of creator
- `createdAt` (`LocalDateTime`): Default `LocalDateTime.now()`

### `ListeningHistory` (`listening_history` table)
- `id` (`String`): Primary Key, `@GeneratedValue(strategy = GenerationType.UUID)`
- `userId` (`String`): Non-null user reference
- `songId` (`String`): Non-null song reference
- `playDurationSeconds` (`Integer`): Nullable
- `playedAt` (`LocalDateTime`): Default `LocalDateTime.now()`

---

## 5. Repository Methods

The four Spring Data JPA repositories define the following query methods:

### `SongRepository`
- `List<Song> findByGenreIgnoreCase(String genre)`: Case-insensitive genre filtering.
- `@Query("SELECT s FROM Song s WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.artist) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.genre) LIKE LOWER(CONCAT('%', :query, '%'))") List<Song> searchSongs(String query)`: JPQL multi-field search across song title, artist, and genre.
- `List<Song> findTop10ByOrderByStreamCountDesc()`: Top 10 tracks by stream popularity.
- Inherited standard CRUD methods from `JpaRepository<Song, String>`.

### `PlaylistRepository`
- `List<Playlist> findByUserId(String userId)`: Look up playlists created by a specific user.
- `List<Playlist> findByIsPublicTrue()`: Fetch all public playlists for discovery.
- Inherited standard CRUD methods from `JpaRepository<Playlist, String>`.

### `ListeningHistoryRepository`
- `List<ListeningHistory> findTop50ByUserIdOrderByPlayedAtDesc(String userId)`: Retrieve the user's latest 50 played tracks in reverse chronological order.
- Inherited standard CRUD methods from `JpaRepository<ListeningHistory, String>`.

### `UserRepository`
- `Optional<User> findByEmail(String email)`: User lookup by email address.
- `Boolean existsByEmail(String email)`: Verification check during user registration.
- Inherited standard CRUD methods from `JpaRepository<User, String>`.

---

## 6. Existing API Calls

All frontend network calls are defined in `frontend/src/services/api.js` and prefixed with `/api` (proxied by Vite to `http://localhost:8080`):

| HTTP Method | Route | Request Body / Headers | Expected Response | Calling Service / Component |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | `{ email, password }` | `{ token, user: { id, email, username, avatarUrl } }` | `api.login` / `AuthContext.jsx` |
| `POST` | `/api/auth/register` | `{ email, password, username }` | `{ token, user: { id, email, username, avatarUrl } }` | `api.register` / `AuthContext.jsx` |
| `GET` | `/api/songs` | `Authorization: Bearer <token>` | `Song[]` | `api.getSongs` / `AuthContext.jsx` (health check) |
| `GET` | `/api/songs/:id` | `Authorization: Bearer <token>` | `Song` | `api.getSongById` |
| `POST` | `/api/history` | `{ songId, playDurationSeconds }` | None / 200 OK | `api.logPlayEvent` / `AudioContext.jsx` |
| `GET` | `/api/playlists` | `Authorization: Bearer <token>` | `Playlist[]` | `api.getPlaylists` |
| `POST` | `/api/playlists` | `{ title, description, coverUrl, isPublic, songIds }` | `Playlist` | `api.createPlaylist` |
| `POST` | `/api/recommendations/ai-playlist` | `{ prompt, targetFeatures }` | `Song[]` | `api.getAIRecommendations` |

---

## 7. Missing Controllers

**No REST controllers exist in the backend.** To serve the frontend endpoints, the following controllers must be implemented:

1. **`AuthController` (`@RestController`, `@RequestMapping("/api/auth")`)**:
   - `POST /login`: Validate credentials, issue JWT, return `AuthResponse`.
   - `POST /register`: Verify unique email, encode password, save `User`, return `AuthResponse`.
2. **`SongController` (`@RestController`, `@RequestMapping("/api/songs")`)**:
   - `GET /`: Retrieve all songs (with optional pagination/caching).
   - `GET /{id}`: Retrieve single song by ID.
   - `GET /search?query=`: Execute repository `searchSongs`.
   - `GET /trending`: Return top 10 songs by stream count.
   - `POST /{id}/stream`: Increment stream count.
3. **`PlaylistController` (`@RestController`, `@RequestMapping("/api/playlists")`)**:
   - `GET /`: Retrieve public playlists or user's playlists based on auth token.
   - `GET /{id}`: Retrieve single playlist by ID.
   - `POST /`: Create new playlist assigned to authenticated user.
   - `PUT /{id}`: Update playlist metadata and song list.
   - `DELETE /{id}`: Delete user playlist.
4. **`ListeningHistoryController` (`@RestController`, `@RequestMapping("/api/history")`)**:
   - `POST /`: Log a play event for the authenticated user.
   - `GET /`: Fetch top 50 listening history records.
5. **`RecommendationController` (`@RestController`, `@RequestMapping("/api/recommendations")`)**:
   - `POST /ai-playlist`: Accept `{ prompt, targetFeatures }` and return ranked songs based on feature vector similarity.

---

## 8. Missing Services

**No service layer exists in the backend.** To implement business logic, the following `@Service` beans must be created:

1. **`AuthService`**: Authenticate via `AuthenticationManager`, encode passwords with `PasswordEncoder`, manage user registration validation, and generate JWT response tokens.
2. **`SongService`**: Query song catalog, handle caching via Caffeine (`@Cacheable("songs")`), execute search, and handle stream count updates.
3. **`PlaylistService`**: Validate ownership, enforce UUID generation for playlists, update track order/members, and manage public/private visibility.
4. **`ListeningHistoryService`**: Asynchronously log playback duration and retrieve user listening history.
5. **`RecommendationService`**: Implement server-side vector distance computation and cosine similarity matching.
6. **`SupabaseStorageService`**: Manage song file streaming and cover upload signed URLs.

---

## 9. Missing Security Classes

Although Spring Security and JJWT are declared in `pom.xml`, **no security configuration or helper classes exist**:

1. **`SecurityConfig` (`@Configuration`, `@EnableWebSecurity`)**:
   - Missing `SecurityFilterChain` bean to configure endpoint access permissions.
   - Missing CORS configuration bean (`CorsConfigurationSource`) for cross-origin requests.
   - Missing session management policy (`SessionCreationPolicy.STATELESS`).
2. **`JwtUtils` / `JwtTokenProvider`**:
   - Missing token generation (`Jwts.builder()`), signature verification (`Keys.hmacShaKeyFor()`), subject extraction, and expiration validation logic.
3. **`JwtAuthenticationFilter` (`OncePerRequestFilter`)**:
   - Missing filter to intercept `Authorization: Bearer <token>`, validate the token, load user details, and populate `SecurityContextHolder`.
4. **`CustomUserDetailsService` (`UserDetailsService`)**:
   - Missing loader to retrieve `User` by email from `UserRepository` and convert to `UserDetails`.
5. **`PasswordEncoder`**:
   - Missing `BCryptPasswordEncoder` bean definition for secure password hashing.
6. **Authentication Exception Handlers**:
   - Missing `AuthenticationEntryPoint` (401 Unauthorized handler) and `AccessDeniedHandler` (403 Forbidden handler).

---

## 10. Missing Configuration

1. **Spring Profiles & Fallback Database**:
   - No `application-dev.yml` or `application-local.yml` profile.
   - No local database configuration (H2 in-memory or local PostgreSQL container); without live Supabase credentials, the application cannot run locally.
2. **Multipart File Upload Limits**:
   - Missing `spring.servlet.multipart.max-file-size` and `max-request-size` configuration for audio file uploads.
3. **Environment Variables Template**:
   - No `.env` or `.env.example` in the frontend directory to document `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. **Database Migration / Schema Versioning**:
   - Currently relies on `spring.jpa.hibernate.ddl-auto: update` against a remote pooler without Flyway or Liquibase.

---

## 11. Hardcoded URLs

| Location | Hardcoded Value | Description |
| :--- | :--- | :--- |
| `backend/src/main/resources/application.yml` | `jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:5432/postgres` | Default fallback JDBC URL |
| `backend/src/main/resources/application.yml` | `https://xyzcompany.supabase.co` | Default fallback Supabase URL |
| `frontend/src/services/supabase.js` | `https://xyzcompany.supabase.co` | Fallback Supabase client URL |
| `frontend/vite.config.js` | `http://localhost:8080` | Proxy destination for `/api` calls |
| `frontend/src/services/api.js` | `const BASE_URL = '/api'` | Fixed API prefix |
| `frontend/src/data/initialSongs.js` | `https://cdn.pixabay.com/download/audio/...` | 12 hardcoded Pixabay CDN audio URLs |
| `frontend/src/data/initialSongs.js` | `https://images.unsplash.com/...` | 15+ hardcoded Unsplash image URLs |

---

## 12. Demo / Fallback Logic

The frontend contains extensive fallback mechanisms to ensure a functional UI experience without an active backend:

1. **Authentication Fallbacks (`frontend/src/services/api.js`, `frontend/src/context/AuthContext.jsx`)**:
   - `api.login` and `api.register` catch network errors and return mock JWT `demo-jwt-token-playx-2026` and a mock user.
   - `AuthContext.jsx` falls back to `defaultDemoUser` ("Alex Vance", `alex.listener@playx.io`, `Premium Pro`).
2. **Catalog Fallbacks (`frontend/src/services/api.js`)**:
   - `api.getSongs`: Returns `INITIAL_SONGS` when backend request fails.
   - `api.getSongById`: Searches `INITIAL_SONGS` client-side.
   - `api.getPlaylists`: Returns `INITIAL_PLAYLISTS`.
   - `api.createPlaylist`: Creates in-memory playlist with `pl-${Date.now()}`.
   - `api.logPlayEvent`: Silently ignores network failure.
3. **AI Recommendation Fallbacks (`frontend/src/services/api.js`, `recommendationEngine.js`)**:
   - `api.getAIRecommendations` returns `null` on network failure, causing `AIDiscovery.jsx` and `Home.jsx` to execute client-side vector calculations via `recommendationEngine.js`.
4. **Playback State Fallbacks (`frontend/src/context/AudioContext.jsx`)**:
   - Pre-seeds initial queue with `INITIAL_SONGS`.
   - Pre-seeds liked songs with `['song-1', 'song-4', 'song-6']`.
   - Pre-seeds listening history with two dummy past entries.

---

## 13. Security Problems

1. **Exposed Credentials in Default Config**:
   - `backend/src/main/resources/application.yml` contains a plain-text default database password `[REDACTED]` and placeholder username `postgres.xyzcompany`.
   - `application.yml` contains a 64-character hardcoded JWT secret `[REDACTED]`.
   - `frontend/src/services/supabase.js` and `application.yml` contain a dummy JWT anon key `[REDACTED]`.
2. **Spring Security Default Route Lockdown**:
   - Because `spring-boot-starter-security` is on the classpath without a `SecurityFilterChain`, Spring Security activates HTTP Basic authentication by default and generates a random password in the console. All incoming requests to `/api/**` are rejected with `401 Unauthorized`.
3. **Plain-Text Password Handling**:
   - No `PasswordEncoder` bean exists to hash passwords before storing them in the `passwordHash` field of `User`.
4. **Local Storage Authentication Token Storage**:
   - The frontend stores JWTs in `localStorage` (`playx_jwt_token`), which is vulnerable to XSS; transition to secure HttpOnly cookies or strict CSP is recommended.
5. **Entity ID Assignment Vulnerability**:
   - `Song` and `Playlist` entities lack `@GeneratedValue`. A `POST /playlists` request from a client could overwrite existing records or fail with null primary keys if IDs are not generated server-side.

---

## 14. Deployment Problems

1. **No Local Database Profile**:
   - Spring Boot fails to start if the external Supabase instance is unreachable, preventing offline development and testing.
2. **Port Allocation & Reverse Proxy**:
   - Frontend runs on port 3000; backend on port 8080. In production, a reverse proxy (e.g. Nginx, Docker Compose, or serving static assets via Spring Boot) is needed to avoid cross-origin proxy issues.
3. **Missing Containerization**:
   - The project root lacks a `Dockerfile` and `docker-compose.yml` to coordinate multi-container deployment (PostgreSQL + Spring Boot + Vite/Nginx).
4. **Missing Environment Documentation**:
   - Frontend lacks a `.env.example` file describing required Vite environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`).

---

## 15. Build and Test Problems

The following build and test operations were executed and recorded:

### 1. Backend Maven Test (`mvnw.cmd test`)
- **Execution Command:** `cmd /c "set JAVA_HOME=C:\Program Files\Java\jdk-25&& mvnw.cmd test"`
- **Result:** `BUILD SUCCESS` (Total time: 5.421 s)
- **Finding:** No test sources exist in `src/test/java`. Maven Surefire skipped test execution (`No sources to compile`). Test coverage is **0%**.

### 2. Backend Maven Package (`mvnw.cmd package`)
- **Execution Command:** `cmd /c "set JAVA_HOME=C:\Program Files\Java\jdk-25&& mvnw.cmd package"`
- **Result:** `BUILD SUCCESS` (Total time: 3.665 s)
- **Artifact:** Successfully built `backend/target/playx-music-player-1.0.0-SNAPSHOT.jar`.

### 3. Backend Application Runtime Startup (`mvnw.cmd spring-boot:run`)
- **Execution Command:** `cmd /c "set JAVA_HOME=C:\Program Files\Java\jdk-25&& mvnw.cmd spring-boot:run"`
- **Result:** `BUILD FAILURE` (Process terminated with exit code 1)
- **Stack Trace Summary:**
  ```
  Caused by: org.hibernate.exception.GenericJDBCException: Unable to open JDBC Connection for DDL execution
  Caused by: org.postgresql.util.PSQLException: FATAL: (ENOTFOUND) tenant/user postgres.xyzcompany not found
      at com.zaxxer.hikari.pool.HikariPool.checkFailFast(HikariPool.java:561)
      at org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean.createNativeEntityManagerFactory
  ```
- **Finding:** The application crashes immediately upon launch because HikariCP fails to connect to the placeholder remote Supabase PostgreSQL database during Hibernate schema validation.

### 4. Frontend Production Build (`npm run build`)
- **Execution Command:** `npm run build` (in `frontend/`)
- **Result:** `BUILD SUCCESS` (Total time: 11.06 s)
- **Output:**
  ```
  vite v5.4.21 building for production...
  ✓ 1589 modules transformed.
  dist/index.html                   1.03 kB │ gzip:  0.60 kB
  dist/assets/index-bXB0G1G_.css    6.53 kB │ gzip:  2.02 kB
  dist/assets/index-CVX-zajz.js   243.22 kB │ gzip: 67.97 kB
  ✓ built in 11.06s
  ```
- **Finding:** Frontend compiles cleanly with zero syntax, JSX, or bundling errors.

---

## 16. Recommended Implementation Order

To transition from Phase 0 to a fully integrated production application without breaking changes, implement features in the following sequence:

### Phase 1: Environment & Local Development Configuration
1. Create a `dev` Spring profile with an in-memory **H2 database** (or local PostgreSQL) so the backend can boot offline without requiring Supabase credentials.
2. Externalize all credentials into environment variables (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `PLAYX_JWT_SECRET`).
3. Add `frontend/.env.example` documenting all client-side variables.

### Phase 2: Security & Authentication Infrastructure
1. Implement `SecurityConfig` with a `SecurityFilterChain` bean:
   - Permit unauthenticated access to `/api/auth/**`, `/api/songs/**`, and static resources.
   - Secure `/api/playlists/**` and `/api/history/**` with JWT authentication.
   - Configure global CORS to support development and production domains.
2. Implement `PasswordEncoder` bean (`BCryptPasswordEncoder`).
3. Implement `JwtUtils` for token creation, parsing, and claims extraction.
4. Implement `JwtAuthenticationFilter` and `CustomUserDetailsService`.

### Phase 3: Core Backend Services & REST Controllers
1. Implement `AuthService` and `AuthController` (`/api/auth/login`, `/api/auth/register`).
2. Implement `SongService` and `SongController` (`/api/songs`, `/api/songs/{id}`, `/api/songs/search`, `/api/songs/trending`).
3. Implement `PlaylistService` and `PlaylistController` (CRUD endpoints with server-side UUID generation).
4. Implement `ListeningHistoryService` and `ListeningHistoryController` (`/api/history`).

### Phase 4: Server-Side AI Recommendation Engine
1. Port vector distance and cosine similarity algorithms to `RecommendationService`.
2. Implement `RecommendationController` (`POST /api/recommendations/ai-playlist`).

### Phase 5: Database Seeding & Audio Storage
1. Implement a `CommandLineRunner` seeder that reads initial songs and playlists into the database if the tables are empty.
2. Configure Supabase storage bucket integration for audio and image uploads.

### Phase 6: Automated Testing & Verification
1. Add `src/test/java` unit tests for repositories, services, and security filters.
2. Add `@SpringBootTest` integration tests with H2 database.
3. Verify end-to-end communication between React frontend and Spring Boot backend.

### Phase 7: Containerization & Production Packaging
1. Create a root `Dockerfile` and `docker-compose.yml` for unified deployment.
2. Configure frontend production static file serving via Spring Boot or Nginx.
