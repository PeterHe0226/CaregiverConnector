const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

//@route POST api/posts
//@desc create post
//acess private
router.post('/', [ auth, [
    check('text', 'Post text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save();
        res.json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});


//@route GET api/posts
//@desc get all posts
//acess private
router.get('/', auth, async (req, res) => {
    try {
        //sort start from the most recent post
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});


//@route GET api/posts/:id
//@desc get post by id
//acess private
router.get('/:id', auth, async (req, res) => {
    try {
        //sort start from the most recent post
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found.'});
        }
        res.json(post);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found.'});
        }
        res.status(500).send('Server Error!');
    }
});

//@route DELETE api/posts/:id
//@desc delete post by id
//acess private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found.'});
        }
        //check if the user actually owns the post
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to delete this post.'});
        }
        await post.remove();
        res.json({ msg: 'Post deleted.' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found.'});
        }
        res.status(500).send('Server Error!');
    }
});

//@route PUT api/posts/like/:id
//@desc like an id
//acess private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //check if the post is already liked by the user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked by the user.'});
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});

//@route PUT api/posts/unlike/:id
//@desc unlike an id
//acess private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //check if the post is already liked by the user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not yet been liked by the user.'});
        }
        //get remove index
        const removeIdx = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIdx, 1);
        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});

//@route POST api/posts/comment/:id
//@desc comment on a post
//acess private
router.post('/comment/:id', [ auth, [
    check('text', 'Post text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});

//@route DELETE api/posts/comment/:post_id/:comment_id
//@desc delete a comment on a post
//acess private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        //pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        //check if comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist.' });
        }
        //check logged in user actually owns the comment
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to delete this comment.' });
        }
        //get remove index
        post.comments = post.comments.filter(({ id }) => id !== req.params.comment_id);
        await post.save();
        res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});
module.exports = router;