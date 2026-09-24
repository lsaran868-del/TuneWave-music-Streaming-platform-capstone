import React, { useRef, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';

export default function AudioVisualizer({ width = 120, height = 36, barColor = '#1db954' }) {
  const canvasRef = useRef(null);
  const { analyserRef, isPlaying } = useAudio();
  const animationIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const renderFrame = () => {
      const bufferLength = analyserRef.current ? analyserRef.current.frequencyBinCount : 32;
      const dataArray = new Uint8Array(bufferLength);

      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(dataArray);
      } else {
        // Fallback subtle idle simulation if playing without analyser or paused
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = isPlaying ? Math.floor(Math.random() * 80 + 40) : 10;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.8;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        // Gradient color for visualizer bars
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, barColor);
        gradient.addColorStop(1, '#06b6d4');

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 6;
        ctx.shadowColor = barColor;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 2;
      }

      animationIdRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isPlaying, barColor, analyserRef]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'block', borderRadius: '4px' }}
    />
  );
}
