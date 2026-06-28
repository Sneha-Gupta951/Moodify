import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const songsDir = path.join(__dirname, 'public', 'songs');
const outputDir = path.join(__dirname, 'src', 'data');
const outputFile = path.join(outputDir, 'songs.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to generate the JSON file
function generateSongsJson() {
  if (!fs.existsSync(songsDir)) {
    console.err(`[Error] The directory ${songsDir} does not exist.`);
    console.log(`Creating dummy directory ${songsDir} for you to place songs into.`);
    fs.mkdirSync(songsDir, { recursive: true });
    return;
  }

  const files = fs.readdirSync(songsDir);
  
  // Filter for only mp3 files
  const mp3Files = files.filter(file => path.extname(file).toLowerCase() === '.mp3');

  const songsData = mp3Files.map((file, index) => {
    const title = path.basename(file, '.mp3');

    return {
      id: index + 1,
      title: title,
      artist: "Unknown Artist",
      album: "Unknown Album",
      genre: "Unknown",
      mood: "Happy",
      language: "English",
      duration: "",
      image: "/images/default.jpg", 
      audio: `/songs/${file}`
    };
  });

  fs.writeFileSync(outputFile, JSON.stringify(songsData, null, 2));
  console.log(`✅ Successfully generated songs.json with ${songsData.length} songs at ${outputFile}`);
}

generateSongsJson();
