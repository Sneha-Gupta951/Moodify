import fs from 'fs';
import path from 'path';

const songsFile = path.resolve('src/data/songs.json');
const raw = fs.readFileSync(songsFile, 'utf-8');
const data = JSON.parse(raw);

const moods = ["Good", "Bad", "Neutral", "Surprised"];

const updated = data.map(song => {
  // Deterministic mood based on string length and character codes so it's consistent
  let score = 0;
  for(let i=0; i<song.title.length; i++) {
    score += song.title.charCodeAt(i);
  }
  
  const assignedMood = moods[score % moods.length];
  song.mood = assignedMood;
  
  return song;
});

fs.writeFileSync(songsFile, JSON.stringify(updated, null, 2));

const minimalOutput = updated.map(s => ({
  title: s.title,
  artist: s.artist,
  mood: s.mood
}));

console.log(JSON.stringify(minimalOutput, null, 2));
