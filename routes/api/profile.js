const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const profile = require('../../models/Profile');
const users = require('../../models/User');
const validateprofileinput = require('../../validations/profile');
const validateexperienceinput = require('../../validations/experience');
const validateeducationinput = require('../../validations/education')

//@Route  GET api/profile/test
//@Desc   Test post route
//@access Public
router.get('/test', (req, res) =>  res.json({"message": "Profile works"}));

//@Route  GET api/profile
//@Desc   Get current users profile
//@access Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    let errors =  {};
    profile.findOne({ user: req.user.id})
    .populate('user', ['name', 'avatar'])
    .then(profile => {
        if(!profile){
            errors.msg =" there is no profile for this User"
            res.status(404).json(errors);
        }
        res.json(profile)
    })
    .catch(err => res.status(404).json(err));
});

//@Route  GET api/profile/all
//@Desc   get all profiles
//@access Private - backend api route
router.get('/all', passport.authenticate('jwt', {session: false}), (req, res) =>{
    const errors = {};
    profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
        if(!profiles){
            errors.noprofiles ="no profiles at this moment";
        }
        res.json(profiles);
    })
    .catch(err => {
        res.status(400).json({noprofiles: 'profiles cannot be retrieved from the database due to some internal error'})
    })
})
//@Route  GET api/profile/handle/:handle
//@Desc   get user profile by handle
//@access Public - backend api route

router.get('/handle/:handle', (req, res) => {
    const errors = {}
        profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => {
            res.status(404).json({noprofile: 'There is no profile for this user'});
        })
});

//@Route  GET api/profile/id
//@Desc   get user profile
//@access Public - backend api route

router.get('/id/:user_id', (req, res) => {
    const errors = {}
        profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => {
            res.status(404).json({noprofile: 'There is no profile for this user'});
        })
});

//@Route  POST api/profile
//@Desc   Create and update User profile
//@access Private
router.post('/', 
    passport.authenticate('jwt', {session: false}),
    (req, res) => {

        console.log(req.body);
        const {errors, isValid } = validateprofileinput(req.body);

        if(errors.length!==0){
            var err = {}
            errors.forEach(y => {
                for(var att in y)
                    err[att] = y[att];
            })

            res.status(400).json(err);
        }

        //get fields
    const  profilefields = {}
    profilefields.user = req.user.id; 
    console.log(req.user.id)
    if(req.body.handle) profilefields.handle = req.body.handle ;
    if(req.body.company) profilefields.company = req.body.company ; 
    if(req.body.website) profilefields.website = req.body.website ; 
    if(req.body.location) profilefields.location = req.body.location ; 
    if(req.body.bio) profilefields.bio = req.body.bio ; 
    if(req.body.status) profilefields.status = req.body.status ; 
    if(req.body.githubusername) profilefields.githubusername = req.body.githubusername ; 
    if(typeof (req.body.skills !=undefined)){
        profilefields.skills = req.body.skills.split(",");
    }
    //social
    profilefields.social = {};
    if(req.body.youtube) profilefields.social.youtube = req.body.youtube; 
    if(req.body.facebook) profilefields.social.facebook = req.body.facebook;
    if(req.body.twitter) profilefields.social.twitter = req.body.twitter; 
    if(req.body.linkedin) profilefields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profilefields.social.instagram = req.body.social.instagram; 


    profile.findOne({ user: req.user.id })
    .then(Profile => {
        if(Profile){
            //update
            profile.findOneAndUpdate({ user: req.user.id}, 
                {$set: profilefields}, 
                {new : true})
            .then(profile => {
                res.json(profile);
            })
        }
        else {
            //save a new profile.
            //First - check if handle exists.
            profile.findOne({handle: profilefields.handle}).
            then(profilee => {
                if(profilee){
                    errors.handle = "that handle already exists";
                    res.status(400).json(errors);
                }
                //save profile
                else{
                    new profile(profilefields).save()
                    .then(profile => {
                        res.json(profile);
                    })
                }
            })
        }
    }).catch(error => console.log("Error while trying to find profile linked with" + req.user.email + "is " + error))
});

//@Route  POST api/profile/experience
//@Desc   Add experience to profile
//@access Private

router.post('/experience', passport.authenticate('jwt', {session:false}), (req, res)=>{

    const {errors, isValid} = validateexperienceinput(req.body);

    if(errors.length!==0){
        var err = {}
        errors.forEach(y => {
            for(var att in y)
                err[att] = y[att];
        })

        res.status(400).json(err);
    }

    profile.findOne({user: req.user.id})
    .then(profile=>{
        if(!profile){
            errors.noprofile = 'There is no profile for this user';
            res.status(404).json(errors);
        }
        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location : req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        }

        profile.experiences.unshift(newExp);

        profile.save().then(profile => {
            res.json(profile);
        });
    })
})

//@Route  Delete api/profile/experience
//@Desc   Delete experience to profile
//@access Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session:false}), (req, res)=>{

    console.log(req.user.id)

    profile.findOne({user: req.user.id})
    .then(profile => {
        
        const removeIndex = profile.experiences
                        .map(item => item._id)
                        .indexOf(req.params.exp_id);
        
        profile.experiences.splice(removeIndex, 1);

        //save
        profile.save().then(profile => res.json(profile));      
    })
    .catch(error => {
        console.log(error)
        res.status(404).json(error);
    })
})

//@Route  POST api/profile/education
//@Desc   Add education to profile
//@access Private

router.post('/education', passport.authenticate('jwt', {session:false}), (req, res)=>{

    const {errors, isValid} = validateeducationinput(req.body);

    if(errors.length!==0){
        var err = {}
        errors.forEach(y => {
            for(var att in y)
                err[att] = y[att];
        })

        res.status(400).json(err);
    }

    profile.findOne({user: req.user.id})
    .then(profile=>{
        if(!profile){
            errors.noprofile = 'There is no profile for this user';
            res.status(404).json(errors);
        }
        const newEdu = {
            degree: req.body.degree,
            majors: req.body.majors,
            school : req.body.school,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            area : req.body.area,
            description: req.body.description
        }

        profile.education.unshift(newEdu);

        profile.save().then(profile => {
            res.json(profile);
        });
    })
})

//@Route  Delete api/profile/education
//@Desc   Delete education from profile
//@access Private
router.delete('/education/:edu_id', passport.authenticate('jwt', {session:false}), (req, res)=>{

    console.log(req.user.id)

    profile.findOne({user: req.user.id})
    .then(profile => {
        
        const removeIndex = profile.education
                        .map(item => item._id)
                        .indexOf(req.params.edu_id);
        
                        console.log(removeIndex)
        if(removeIndex>0){
            profile.education.splice(removeIndex, 1);

            //save
            profile.save().then(profile => res.json(profile));
        }
        else{
                res.json(profile);
        }
             
    })
    .catch(error => {
        console.log(error)
        res.status(404).json(error);
    })
})

//@Route  Delete api/profile/
//@Desc   Delete profile
//@access Private
router.delete('/', passport.authenticate('jwt', {session:false}),
     (req, res)=>{
        profile.findOneAndRemove({user : req.user.id})
        .then(() => {
                res.status(201).send("Profile successfully deleted");
        })
        .catch(err => {
            console.log(err)
            res.json(err);
        })
    }
)


module.exports = router ;