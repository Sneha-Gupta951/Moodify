const express = require("express")
const router = express.Router()
const upload = require("../middlewear/upload.middleware")
const songController = require("../controllers/song.controller")
/**
 * Post /api/songs
 */
router.post("/", upload.single("song"), songController.uploadSong)

router.get('/', songController.getSong)
module.exports = router