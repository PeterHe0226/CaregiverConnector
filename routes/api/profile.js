const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const { check, validationResult } = require('express-validator');
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');
const request = require('request');
const config = require('config');

//@route GET api/profile/me
//@desc get current user's profile
//acess private
//protect this route, add auth
router.get('/me', auth, async (req, res) => {
    try {
        //set  user field of the profile with the id in the token
        //populate profile with areas in user model
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        //check if profile exists
        if (!profile) {
            return res.status(400).json({ msg:'There is no profile for current user.' });
        }
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});


//@route POST api/profile
//@desc create or update a user profile
//acess private
router.post('/', [auth, [
    check('status', 'Status is required.').not().isEmpty(),
    check('skills', 'Skills are required input.').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
        // destructure the request
        const {
        website,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
        // spread the rest of the fields we don't need to check
        ...rest
        } = req.body;

            // build a profile
        const profileFields = {
        user: req.user.id,
        website:
            website && website !== ''
            ? normalize(website, { forceHttps: true })
            : '',
        skills: Array.isArray(skills)
            ? skills
            : skills.split(',').map((skill) => ' ' + skill.trim()),
        ...rest
        };

        // Build socialFields object
        const socialFields = { youtube, twitter, instagram, linkedin, facebook };

        // normalize social fields to ensure valid url??
        for (const [key, value] of Object.entries(socialFields)) {
        if (value && value.length > 0)
            socialFields[key] = normalize(value, { forceHttps: true });
        }
        // add to profileFields
        profileFields.social = socialFields;

        try {
        // Using upsert option (creates new doc if no match is found):
        let profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        return res.json(profile);
        } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
        }
});


//@route GET api/profile
//@desc get all profiles
//acess public
router.get('/', async (req, res) => {
    try {
        //populate name and avatar from user to profile
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});

//@route GET api/profile/user/:user_id
//@desc get profile by user id
//acess public
router.get('/user/:user_id', async (req, res) => {
    try {
        //get user_id from the url using req.params.
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found for this user ID.' });
        }
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(404).json({ msg: 'Profile not found for this user ID.' });
        }
        res.status(500).send('Server Error!');
    }
});

//@route DELETE api/profile
//@desc delete profile, user and post
//acess private
router.delete('/', auth, async (req, res) => {
    try {
        //remove post
        await Post.deleteMany({ user: req.user.id })

        //remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        //remove user
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'User and Profile deleted.'});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});


//@route PUT api/profile/experience
//@desc add profile experience
//acess private

router.put('/experience', [auth, [
    check('title', 'Experience title is required.').not().isEmpty(),
    check('company', 'Experience company is required.').not().isEmpty(),
    check('from', 'Experience from date is required and needs to be from the past').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //add to the array from the beginning
        profile.experience.unshift(req.body);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

//@route DELETE api/profile/experience/:exp_id
//@desc Delete experience from profile
//acess private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //get remove index
        const removeIdx = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        //remove experience at that index
        profile.experience.splice(removeIdx, 1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//@route PUT api/profile/education
//@desc add profile education
//acess private

router.put('/education', [auth, [
    check('school', 'Education school is required.').not().isEmpty(),
    check('degree', 'Education degree is required.').not().isEmpty(),
    check('fieldofstudy', 'Education field of study is required.').not().isEmpty(),
    check('from', 'Education from date is required and needs to be from the past').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.education.unshift(req.body);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

//@route DELETE api/profile/education/:edu_id
//@desc Delete education from profile
//acess private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //get remove index
        const removeIdx = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        //remove experience at that index
        profile.education.splice(removeIdx, 1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//@route GET api/profile/github/:username
//@desc  Get user repos from github
//acess public
router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };
        request(options, (error, response, body) => {
            if (error) {
                console.error(error);
            }
            if (response.statusCode !== 200) {
                res.status(404).json({ msg: 'No Github profile found.'});
            }
            res.json(JSON.parse(body));

        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;