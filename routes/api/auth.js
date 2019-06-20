const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar');


//Load User model
const User = require('../../models/User');

//@Route  GET api/users/test
//@Desc   Test users route
//@access Public
router.get('/test', (req, res) =>  res.json({"message": "Auth works"}));

//@Route  GET api/users/register
//@Desc Register user
//@access public

router.post('/register', (req, res)=> {
    User.findOne({email: req.body.email}).then(user => {
        if(user)
        return res.status(400).json({email:'Email already exists'});
        else{

            const avatar = gravatar.url(req.body.url, {
                s: '200', //Size
                r: 'pg',  //Rating
                d: 'mm'   //Default
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar: avatar
            });

            bcrypt.genSalt(10).then(salt => {
                bcrypt.hash(newUser.password, salt).then(hash =>{
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log("error while saving new user post successful hashing of password is\t"+err))
                })
                .catch(err => {
                    throw err;
                })

            })
        }
    
    })
})

module.exports = router ;