import { createContext } from "react";
import { useState } from "react";


export const songContext = createContext()

export const SongContextProvider =({ children })=>{

  const [ song, setSong ] = useState({
    "url": "https://ik.imagekit.io/tsoxnjfcc/cohort-2/modify/songs/Jatt_Mehkma__RiskyjaTT.CoM__u9aMHopyg.mp3",
        "posterURL": "https://ik.imagekit.io/tsoxnjfcc/cohort-2/modify/posters/Jatt_Mehkma__RiskyjaTT.CoM__tlkvwUMs5.jpeg",
        "title": "Jatt Mehkma (RiskyjaTT.CoM)",
        "mood": "sad",
  })

  const [loading , setloading ] =useState(false)
  return (
    <SongContext.Provider value ={{loading, setLoading, song, setSong}}>
      {children}

    </SongContext.Provider>
  )
}