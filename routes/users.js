const express = require('express')
const router = express.Router()
const postController = require('../controllers/posts')
const upload = require("../middleware/multer")
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get("/:id", ensureAuth, postController.getUserProfile)

module.exports = router;