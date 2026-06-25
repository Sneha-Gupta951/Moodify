const songModel = require("../models/song.model")
const storageServices = require("../services/storage.services")
const id3 = require("node-id3")

async function uploadSong(req, res){
  const songBuffer = req.file.buffer
  const { mood } = req.body

  const tags =id3.read(songBuffer)
  console.log(tags);
  const [ songFile, posterFile ] =await Promise.all([
    storageServices.uploadFile({
    buffer:songBuffer,
    filename: tags.title + ".mp3",
    folder:"/cohort-2/modify/songs"
  }),
  storageServices.uploadFile({
    buffer:tags.image.imageBuffer,
    filename:tags.title+".jpeg",
    folder:"/cohort-2/modify/posters"
  })
  ])
   


  const song = await songModel.create({
    title:tags.title,
    url:songFile.url,
    posterURL: posterFile.url,
    mood
  })

  res.status(201).json({
    message:"song created succesfully",
    song
  })
  
}

async function getSong(req, res){
  const { mood }= req.query

  const song = await songModel.findOne({
    mood
  })
  res.status(200).json({
    message:"song fetched succesfully",
    song,
  })
}
module.exports = {
  uploadSong , getSong
}