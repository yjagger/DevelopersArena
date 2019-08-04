const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');


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

    const {errors , isValid } = validateRegisterInput(req.body);
    console.log(" errors and isValid are" + errors.length, isValid);
    //check validation
    if(errors.length !== 0){
        let x = {};
        console.log("Keys are "+Object.keys(errors));
        errors.forEach( (y) => {
            for(var att in y)
                x[att] = y[att];
                   //Object.assign(x, y);
        })  
        return res.status(400).json(x);
    }

    User.findOne({email: req.body.email}).then(user => {
        if(user)
        return res.status(400).json({emailError:'Email already exists'});
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


//@Route  GET api/users/login
//@Desc   Login User Returning JWT token
//@access public

router.post('/login',  (req, res)=>{
    console.log("req body -->"+req.body.email);
    const {errors, isValid} = validateLoginInput(req.body);
    if(errors.length !==0){
        let x ={} ;
        errors.forEach(y => {
            for(var att in y)
                x[att] = y[att]; //possible because of dynamically generation of keys using [] 

            //Or Object.assign(x, y) -> returns x object with y properties copied (overwritten if they have same key )on x. 
            //Object.assign(target, source); 

            //Or return {...x, y} spreads the x properties and add y properties.
        });
        
        return res.status(400).json(x);
    }
    const email = req.body.email ;
    const password = req.body.password ;

        User.findOne({email: email})
            .then(user => {
                //check for user
                if(!user){
                    return res.status(404).json({
                        emailError: "User not registered with us"
                    })
                }
            
                bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        //User Matched
                        const payload = {
                            id: user.id,
                            name : user.name,
                            avatar: user.avatar
                        }
                        //sign the token
                            jwt.sign(payload,keys.secretOrPrivateKey, {expiresIn: 3600 }, (err, token) => {
                                return res.json({
                                    success: true,
                                    token: 'Bearer '+token
                                })
                            } )       
                    }
                    //check password
                    else
                    return res.status(400).json({
                        passwordError : "password not correct" 
                    });
                })
                
                        })
            .catch(err => {
            res.json({error: err});
        })

})

//@Route  GET api/users/current
//@Desc   Retrieve current user
//@access Private

//passprt.authenticate expects a jwt strategy provided from any middleware available in the main server.js file. We already have a passport.use()
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res)=>{
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
})

/*router.use(function(error, req, res, next){
    console.log("Error while handling the request " + error);
    res.json(error);
})*/

module.exports = router ;