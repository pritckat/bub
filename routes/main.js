const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 
const homeController = require('../controllers/home')
const postController = require('../controllers/posts')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', homeController.getIndex)
router.get('/profile', ensureAuth, postController.getProfile)
router.get('/feed', ensureAuth, postController.getFeed)
router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.get('/logout', authController.logout)
router.get('/signup', authController.getSignup)
router.post('/signup', authController.postSignup)

module.exports = router


/* This is what I need to integrate:
I have temporarily abandoned this idea because it was beciming a time suck (and Leon didn't do it), but we can come back to it if we want each page to have its own <title>

app.get("/", function(req, res){
  res.locals.title = "BUB BUB BUB";
  res.render("home.ejs");
*/
