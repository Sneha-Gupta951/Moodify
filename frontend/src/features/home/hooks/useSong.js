import { getSong } from "../services/song.api";
import { useContext } from "react";
import { songContext } from "../song.context";

export const useSong= ({ children })=>{
  const context = useContext(SongContext)
  const { loading, setLoading, song, useSong}= context

  async function handleGetSong({mood}){
    setLoading(true)
    const data = getSong({mood})
    setSong(data.song)
    setLoading(false)
  }

  return ({loaidng, song, handleGetSong})
}