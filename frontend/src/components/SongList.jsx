import React, { useState } from 'react';
import SongCard from './SongCard';
import songsData from '../data/songs.json';
import '../styles/songCard.css';

const SongList = ({ currentSong, onPlay }) => {
  return (
    <div className="song-list-container">
      {songsData.map((song) => (
        <SongCard 
          key={song.id} 
          song={song} 
          isPlaying={currentSong?.id === song.id}
          onClick={onPlay}
        />
      ))}
    </div>
  );
};

export default SongList;
