package com.tunewave.musicplayer.config;

import com.tunewave.musicplayer.model.AudioFeatures;
import com.tunewave.musicplayer.model.Song;
import com.tunewave.musicplayer.repository.SongRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private final SongRepository songRepository;

    public DataInitializer(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    @Override
    public void run(String... args) {
        if (songRepository.count() > 0) {
            logger.info("Song catalog already initialized with {} tracks.", songRepository.count());
            return;
        }

        logger.info("Initializing TuneWave curated music catalog...");

        List<Song> initialSongs = List.of(
                Song.builder()
                        .title("Cyberpunk Horizon")
                        .artistName("SynthWave Pulse")
                        .albumTitle("Neon Dreams 2088")
                        .duration(198)
                        .audioUrl("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cyberpunk-synthwave-21215.mp3")
                        .coverUrl("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80")
                        .genre("Synthwave")
                        .mood("Energetic")
                        .releaseDate("2024-01-15")
                        .isExplicit(false)
                        .features(new AudioFeatures(124.0, 0.88, 0.72, 0.81, 0.05))
                        .streamCount(14250L)
                        .createdAt(LocalDateTime.now().minusDays(10))
                        .build(),

                Song.builder()
                        .title("Midnight Lo-Fi Study")
                        .artistName("Aura Beats")
                        .albumTitle("Coffee & Code")
                        .duration(165)
                        .audioUrl("https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a7315b.mp3?filename=lofi-study-112191.mp3")
                        .coverUrl("https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80")
                        .genre("Lo-Fi")
                        .mood("Chill")
                        .releaseDate("2024-02-01")
                        .isExplicit(false)
                        .features(new AudioFeatures(84.0, 0.35, 0.50, 0.62, 0.78))
                        .streamCount(28900L)
                        .createdAt(LocalDateTime.now().minusDays(8))
                        .build(),

                Song.builder()
                        .title("Starlight Reverie")
                        .artistName("Celestial Waves")
                        .albumTitle("Deep Cosmos")
                        .duration(210)
                        .audioUrl("https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f7e5b2.mp3?filename=ambient-piano-124483.mp3")
                        .coverUrl("https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80")
                        .genre("Ambient")
                        .mood("Relaxing")
                        .releaseDate("2024-02-14")
                        .isExplicit(false)
                        .features(new AudioFeatures(72.0, 0.22, 0.38, 0.28, 0.92))
                        .streamCount(9800L)
                        .createdAt(LocalDateTime.now().minusDays(6))
                        .build(),

                Song.builder()
                        .title("Electric Velocity")
                        .artistName("Vortex 99")
                        .albumTitle("Overdrive")
                        .duration(184)
                        .audioUrl("https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=energetic-rock-10023.mp3")
                        .coverUrl("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80")
                        .genre("EDM")
                        .mood("Workout")
                        .releaseDate("2024-03-01")
                        .isExplicit(false)
                        .features(new AudioFeatures(132.0, 0.94, 0.85, 0.89, 0.02))
                        .streamCount(35100L)
                        .createdAt(LocalDateTime.now().minusDays(4))
                        .build(),

                Song.builder()
                        .title("Velvet Afternoon")
                        .artistName("Luna Jazz Trio")
                        .albumTitle("Rainy Cafe Sessions")
                        .duration(225)
                        .audioUrl("https://cdn.pixabay.com/download/audio/2022/03/10/audio_c3527b140d.mp3?filename=smooth-jazz-110022.mp3")
                        .coverUrl("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80")
                        .genre("Jazz")
                        .mood("Chill")
                        .releaseDate("2024-03-10")
                        .isExplicit(false)
                        .features(new AudioFeatures(96.0, 0.42, 0.65, 0.58, 0.84))
                        .streamCount(16700L)
                        .createdAt(LocalDateTime.now().minusDays(3))
                        .build(),

                Song.builder()
                        .title("Acoustic Sunrays")
                        .artistName("Echo Valley")
                        .albumTitle("Wildflowers & Woods")
                        .duration(176)
                        .audioUrl("https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=acoustic-guitar-7688.mp3")
                        .coverUrl("https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80")
                        .genre("Acoustic")
                        .mood("Happy")
                        .releaseDate("2024-03-15")
                        .isExplicit(false)
                        .features(new AudioFeatures(108.0, 0.55, 0.82, 0.70, 0.88))
                        .streamCount(21400L)
                        .createdAt(LocalDateTime.now().minusDays(2))
                        .build(),

                Song.builder()
                        .title("Neon Rainfall")
                        .artistName("Kavinsky Mirror")
                        .albumTitle("Dark City Drive")
                        .duration(204)
                        .audioUrl("https://cdn.pixabay.com/download/audio/2022/05/16/audio_c89b71e1f1.mp3?filename=synthwave-retro-109404.mp3")
                        .coverUrl("https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80")
                        .genre("Synthwave")
                        .mood("Focus")
                        .releaseDate("2024-03-20")
                        .isExplicit(false)
                        .features(new AudioFeatures(116.0, 0.76, 0.58, 0.74, 0.12))
                        .streamCount(42000L)
                        .createdAt(LocalDateTime.now().minusDays(1))
                        .build(),

                Song.builder()
                        .title("Cosmic Drift")
                        .artistName("Nebula 7")
                        .albumTitle("Beyond Gravity")
                        .duration(238)
                        .audioUrl("https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=space-ambient-116199.mp3")
                        .coverUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80")
                        .genre("Ambient")
                        .mood("Sleep")
                        .releaseDate("2024-03-22")
                        .isExplicit(false)
                        .features(new AudioFeatures(65.0, 0.18, 0.25, 0.20, 0.95))
                        .streamCount(18300L)
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        songRepository.saveAll(initialSongs);
        logger.info("Successfully seeded {} songs into TuneWave database.", initialSongs.size());
    }
}
