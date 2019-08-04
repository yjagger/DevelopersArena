const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('../../models/Posts');
const ValidatePostsInput = require('../../validations/posts');
const Profile = require('../../models/Profile');
import {app} from '../../server';

//@Route  GET api/posts/test
//@Desc   Test post route
//@access Public
router.get('/test', (req, res) =>  res.json({"message": "Posts works"}));

//@Route  Post api/posts
//@Desc   Create posts route
//@access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    const {errors, isValid} = ValidatePostsInput(req.body)

    if(errors.length!==0){
        var err = {}
        errors.forEach(error => {
            for(var att in error)
                err[att] = error[att];  
            
        })

        err["postError"] = err["postError"] +' '+ req.user.name.split(' ')[0] ;
        res.status(400).json({error:err});
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save()
    .then(post => res.json(post))
    .catch(err => {

        console.log("error while saving the post is"+ err);
        res.json({error: err})})

})

//@Route  Get api/posts
//@Desc   retrieve all posts
//@access Public

router.get('/', (req, res) => {
    console.log("inside the get all posts")
    Post.find()
    .sort({ date: -1})
    .then(posts => {
        res.json(posts)
    })
    .catch(error => res.status(400).json({noPostsFound : 'no posts found'}))
})

//@Route  Get a api/posts/:post_id
//@Desc   get a post by id
//@access Public
router.get('/:post_id', (req, res) => {

    Post.findById(req.params.post_id)
    .sort({ date: -1})
    .then(posts => {
        res.json(posts)
    })
    .catch(error => res.status(400).json({noPostFound: 'no post found'}))
})


//@Route  Delete api/posts/:post_id
//@Desc   Delete a post
//@access Public
router.delete('/:post_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    
    //promise callbacks / promise version of POD
    //


    Profile.findOne({user: req.user.id})
    .then(profile => {
        if(!profile)
            res.status(400).json({NoProfileFound : "Problem loading your profile"})
        else{
        Post.findById(req.params.post_id)
        .then(post => {

            //check for owner
            if(post.user.toString() !== req.user.id){

                res.status(403).json({NotYourProfile : "This post belongs to some other user"});
                return;
            }  
            else{
                console.log("deleting post" +req.params.post_id)
                Post.remove()
                .then(() => res.status(200).json({PostDeleted: "Post successfully deleted"}))
                .catch(error => res.json({error}))
            }
        
            })
        .catch(error => res.json({NoSuchPost : "No post found with this id"}))
        }
    })
    .catch(error => console.log(error))
})

//@Route  POST api/posts/post/like/:post_id
//@Desc   Post a like
//@access Private
router.post('/post/like/:post_id', passport.authenticate('jwt', {session : false}), (req, res) => {
        Profile.findOne({user : req.user.id})
        .then(profile => {
            if(!profile){
                res.status(400).json({NoProfileFound : "Problem loading your profile"})
            }
            else{
                Post.findById(req.params.post_id)
                .then( post => {
                    if(post.likes.filter(like => like.user.toString() == req.user.id).length > 0 ){
                            return res.status(400).json({alreadyLiked : "Usr already liked this post"})
                    }
                    post.likes.unshift({user : req.user.id});
                    post.save()
                    .then(() => res.status(200).json({like : 'Like successful'}))
                    .catch(() => res.status(400).json({likeError : 'Error while saving your like'}))
                    
                })
                .catch(error => {
                    console.log(error);
                    return res.status(400).json({error})
                })
            }
    })
    .catch(error => res.status(400).json({NoProfile: 'Your profile cannot be loaded'}))
})

//@Route  POST api/posts/post/unlike/:post_id
//@Desc   Post a Unlike
//@access Private
router.post('/post/unlike/:post_id', 
    passport.authenticate('jwt', {session : false}),
    (req, res) => {
    Profile.findOne({user : req.user.id})
    .then(profile => {
        if(!profile){
            res.status(400).json({NoProfileFound : "Problem loading your profile"})
        }
        else{
            Post.findById(req.params.post_id)
            .then( post => {
                //post -- object
                //likes -- array
                //like  -- object
                //like.user - String
                var index = post.likes
                            .map(like => like.user)
                            .indexOf(req.user.id)


                if(index < 0 ){
                    return res.status(400).json({alreadyLiked : "User did not like this post"});
                }
                else{

                    post.likes.splice(index, 1);
                    post.save()
                    .then(() => res.status(200).json({like : 'Like removed'}))
                    .catch(() => res.status(400).json({likeError : 'Error while saving your like'}))

                }                
            })
            .catch(error => {
                return res.status(400).json({error})
            })
            }
        })
    .catch(error => res.status(400).json({NoProfile: 'Your profile cannot be loaded'}))
    })

module.exports = router ;

//@Route  POST api/posts/comment
//@Desc   Post a like
//@access Private
router.post('/post/comment/:post_id', passport.authenticate('jwt', {session : false}), (req, res) => {
    Profile.findOne({user : req.user.id})
    .then(profile => {
        if(!profile){
            res.status(400).json({NoProfileFound : "Problem loading your profile"})
        }
        else{
            if(req.body.text !== undefined){
                if(req.body.text.length ==0)
                return res.json({comment: 'empty comment not allowed'});

                Post.findById(req.params.post_id)
                .populate('user', ['name', 'avatar'])
                .then( post => {
                    post.comments.unshift({
                        user : req.user.id, 
                        text: req.body.text, 
                        name: req.user.name,
                        avatar: req.user.avatar    
                    });
                    post.save()
                    .then(() => res.status(200).json({post}))
                    .catch(() => res.status(400).json({commentError : 'Error while saving your comment'}))
                    
                })
                .catch(error => {
                    console.log(error);
                    return res.status(400).json({error})
                })
            }
            else
            return res.json({comment: 'empty comment not allowed'});
        }
    })
    .catch(error => {
        console.log(error);
        res.json({error})
    })
})



//@Route  DELETE api/posts/comment
//@Desc   Delete a comment
//@access Private
router.delete('/post/comment/:post_id/:com_id', passport.authenticate('jwt', {session : false}), (req, res) => {
    try{
        let profile = await Profile.findOne({user: req.user.id})
        if(!profile){
          throw new Error('profile not found');
        }
        else{

            //find post by id, find all comments
            //find the requested comment from all the comments of the post
            //check if comment's user id is equsl to requested user id
            //is yes, allow to delete and delete

            let post = await Post.findById(req.params.post_id)
            let comment = post.comments.find(function(comment){
                return comment.id == req.params.id;
            })
            let commentIndex = post.comments.findIndexOf(function(comment){
                return comment.id == req.params.id;
            })
            //let comment = post.comments.filter(comment => comment.id == req.params.com_id)[0];
            let userAllowed = (comment.user_id==req.user.id) ? true : false;
            if(userAllowed){
                post.comments.splice(commentIndex,1);
            }
            else{
                return res.status(401).json({unAuthorized: 'Unauthorized to delete the message'})
            }
        }
    }
    catch(message){
        app.get('/error', (req, res) => res.status(400).json({error:message}));
    }
})
    

    // Profile.findOne({user : req.user.id})
    // .then(profile => {
    //     if(!profile){
    //         res.status(400).json({NoProfileFound : "Problem loading your profile"})
    //     }
    //     else{
    //         //find the post by id
    //         //go through all the comment to find the requested comment
    //         //if the comment's user id is equals to the current user id
    //         //allow him to delete
    //         //else unauthorized
            
    //         Post.findById(req.params.post_id)
    //         .populate('user', ['name', 'avatar'])
    //         .then(post => {
    //              if(post.comments.filter(comm => comm.id == req.params.com_id)[0].user.toString() == req.user.id){

    //                  //console.log("comment's user is " + post.comments.filter(comm => comm.id == req.params.com_id)[0].user.toString()) ;

    //                 // console.log("index of the comment is " + post.comments.map(comm => comm.id).indexOf(req.params.com_id))

    //                     post.comments.splice(post.comments
    //                         .map(comm => comm.id)
    //                         .indexOf(req.params.com_id),1)
                        
    //                         post.save()
    //                         .then(post => {
    //                         return res.status(200).json({post})
    //                     })
    //                     .catch(err => res.json({err}))
    //              }
    //              else
    //                  return res.status(403).json({post})
    //         })
    //         .catch(error => {
    //             console.log(error)
    //             res.staut(400).json({error: "Can not find post"})
    //         })    
    //     }
    // })
    // .catch(error => {
    //     console.log(error);
    //     res.json({error})
    // })


