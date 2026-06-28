import React, { useEffect, useRef, useState } from 'react';
import '../styles/player.css';

const MusicPlayer = ({ currentSong, songsList, onNext, onPrev }) => {
  const audioRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  // Auto-play when a new song is selected
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.audio;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Error playing audio:", err));
    }
  }, [currentSong]);

  // Handle Play / Pause
  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Handle Time Update for Progress Bar
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle Song Audio Details Loading
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Auto Play Next Song when current ends
  const handleEnded = () => {
    setIsPlaying(false);
    onNext();
  };

  // Seek functionality
  const handleSeek = (e) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Adjust Volume
  const handleVolumeChange = (e) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  // Format time util (e.g. 0:00)
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentSong) return null; // Don't render until a song is selected

  return (
    <div className="music-player-container">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="player-info">
        <img src={currentSong.image} alt={currentSong.title} className="player-image" />
        <div className="player-details">
          <h4>{currentSong.title}</h4>
          <p>{currentSong.artist}</p>
        </div>
      </div>

      <div className="player-controls-container">
        <div className="player-buttons">
          {/* Previous Button */}
          <button className="control-btn" onClick={onPrev}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          {/* Play/Pause Button */}
          <button className="control-btn play-pause-btn" onClick={togglePlay}>
            {isPlaying ? (
              // Pause Icon
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              // Play Icon
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Next Button */}
          <button className="control-btn" onClick={onNext}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>

        <div className="progress-container">
          <span className="time-display">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
          />
          <span className="time-display">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-volume">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" color="rgba(255,255,255,0.7)">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
