const Post = require ('../models/Post')
const cloudinary = require("../middleware/cloudinary");

module.exports = {
  getPost: async (request, response) => {
    try {
      const post = await Post.findOne({_id:request.params.id});
      response.render("post.ejs", { post: post, user: request.user })
    } catch (error) {
      console.error(error)
    }
  },
  createPost: async (request, response) => {
    try{
        const result = await cloudinary.uploader.upload(request.file.path);
        
        await Post.create({
          userId: request.user.id,
          title: request.body.title,
          caption: request.body.caption,
          user: request.user.userName,
          image: result.secure_url,
          cloudinaryId: result.public_id
        })
        console.log('Post has been added!')
        response.redirect('/profile')
    }catch(error){
      console.error(error)
    }
  },
  updatePost: async (request, response) => {
    try {
      let post = await Post.findById(request.params.id);

      if(!post){
        return response.render('error')
      }

      if(post.userId != request.user.id) {
        response.redirect('/profile')
      } else {
        post = await Post.findOneAndUpdate(
          {
            _id: request.params.id
          },
          request.body.caption,        
        );
      response.redirect('/profile');
      }
    } catch (error) {
      console.error(error);
    }
  },
  likePost: async (request, response) => {
      try {
        let post = await Post.findOneAndUpdate(
          { _id: request.params.id },
          { $inc: { likes: 1 } }
        );
        response.redirect(`/posts/${request.params.id}`);
      } catch (error) {
        console.error(error);
      }
    },
  deletePost: async (request, response) => {
    try {
      let post = await Post.findById(request.params.id)
      if (request.user.id != post.userId) {
        response.redirect('/profile')
      } else {
        await Post.deleteOne({
          _id: request.params.id
        })
        await cloudinary.uploader.destroy(post.cloudinaryId);
        console.log('Post Removed')
        response.redirect('/profile')
      }
    }catch(error){
      console.error(error)
    }
  },
  getFeed: async (request, response) => {
    try {
      const allPosts = await Post.find().sort({date: 'desc'})
      response.render('feed.ejs', {posts: allPosts})
    }catch(error){
      console.error(error)
    }
  },
  getProfile: async (request, response) => {
    try {
      const myPosts = await Post.find({userId: request.user.id}).sort({date: 'desc'})
      response.render('profile.ejs', {posts: myPosts, user: request.user})
    } catch(error) {
      console.error(error)
    }
  }
}