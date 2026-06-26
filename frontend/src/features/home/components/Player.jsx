import React, { useContext, useRef, useState, useEffect, useCallback } from 'react';
import { SongContext } from '../song.context';
import './Player.scss';

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const Player = () => {
  const { song, loading } = useContext(SongContext);
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  // Reset player state when song changes
  useEffect(() => {
    if (audioRef.current && song?.url) {
      audioRef.current.src = song.url;
      audioRef.current.load();
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }
  }, [song?.url]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sync playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Close speed menu on outside click
  useEffect(() => {
    const handleClick = () => setShowSpeedMenu(false);
    if (showSpeedMenu) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showSpeedMenu]);

  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Playback error:', err);
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const newTime = pct * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
  };

  const handleVolumeChange = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    setVolume(pct);
    if (pct > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const cycleSpeed = (e) => {
    e.stopPropagation();
    setShowSpeedMenu((prev) => !prev);
  };

  const selectSpeed = (speed) => {
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;
  const volumePct = isMuted ? 0 : volume * 100;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((v) => Math.min(1, v + 0.1));
          setIsMuted(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((v) => Math.max(0, v - 0.1));
          break;
        case 'KeyM':
          toggleMute();
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  return (
    <div className="moodify-player" id="moodify-player">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
        preload="metadata"
      />

      {/* Background poster blur */}
      {song?.posterURL && (
        <div
          className="player__bg"
          style={{ backgroundImage: `url(${song.posterURL})` }}
        />
      )}

      <div className="player__container">
        {/* Poster / Album Art */}
        <div className={`player__poster ${isPlaying ? 'playing' : ''}`}>
          {song?.posterURL ? (
            <img src={song.posterURL} alt={song.title || 'Album Art'} />
          ) : (
            <div className="player__poster-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
          )}
          {/* Vinyl ring effect */}
          <div className="player__vinyl-ring" />
        </div>

        {/* Song Info */}
        <div className="player__info">
          <h2 className="player__title" id="player-title">
            {loading ? 'Loading...' : song?.title || 'No Song Selected'}
          </h2>
          {song?.mood && (
            <span className={`player__mood player__mood--${song.mood}`} id="player-mood">
              {song.mood}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="player__progress-section">
          <span className="player__time" id="player-current-time">{formatTime(currentTime)}</span>
          <div className="player__progress-bar" id="player-progress-bar" onClick={handleSeek}>
            <div className="player__progress-track">
              <div
                className="player__progress-fill"
                style={{ width: `${progressPct}%` }}
              />
              <div
                className="player__progress-thumb"
                style={{ left: `${progressPct}%` }}
              />
            </div>
          </div>
          <span className="player__time" id="player-duration">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="player__controls">
          {/* Speed Control */}
          <div className="player__speed-wrapper">
            <button
              className="player__btn player__btn--speed"
              id="player-speed-btn"
              onClick={cycleSpeed}
              title="Playback Speed"
            >
              {playbackSpeed}x
            </button>
            {showSpeedMenu && (
              <div className="player__speed-menu" id="player-speed-menu">
                {SPEED_OPTIONS.map((s) => (
                  <button
                    key={s}
                    className={`player__speed-option ${s === playbackSpeed ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectSpeed(s);
                    }}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Skip Backward */}
          <button
            className="player__btn player__btn--skip"
            id="player-skip-back"
            onClick={skipBackward}
            title="Rewind 10s"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 17l-5-5 5-5" />
              <path d="M18 17l-5-5 5-5" />
            </svg>
            <span className="player__skip-label">10</span>
          </button>

          {/* Play / Pause */}
          <button
            className={`player__btn player__btn--play ${isBuffering ? 'buffering' : ''}`}
            id="player-play-btn"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isBuffering ? (
              <div className="player__spinner" />
            ) : isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Skip Forward */}
          <button
            className="player__btn player__btn--skip"
            id="player-skip-forward"
            onClick={skipForward}
            title="Forward 10s"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 17l5-5-5-5" />
              <path d="M6 17l5-5-5-5" />
            </svg>
            <span className="player__skip-label">10</span>
          </button>

          {/* Volume */}
          <div className="player__volume-wrapper">
            <button
              className="player__btn player__btn--volume"
              id="player-mute-btn"
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : volume < 0.5 ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
            <div className="player__volume-bar" id="player-volume-bar" onClick={handleVolumeChange}>
              <div className="player__volume-track">
                <div
                  className="player__volume-fill"
                  style={{ width: `${volumePct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
