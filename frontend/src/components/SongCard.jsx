import React from 'react';
import '../styles/songCard.css';

const SongCard = ({ song, isPlaying, onClick }) => {
  return (
    <div 
      className={`song-card ${isPlaying ? 'active' : ''}`}
      onClick={() => onClick(song)}
    >
      <img 
        src={song.image || "/images/default.jpg"} 
        alt={song.title} 
        className="song-card-image" 
      />
      
      <div className="song-card-info">
        <h3 className="song-title">{song.title}</h3>
        <p className="song-artist">{song.artist}</p>
        
        <div className="song-badges">
          {song.genre && <span className="badge">{song.genre}</span>}
          {song.mood && <span className="badge mood">{song.mood}</span>}
        </div>
      </div>
    </div>
  );
};

export default SongCard;
