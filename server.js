
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');

const db = require('./config/keys').mongoURI ;

const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const error = require('/routes/api.error');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose
    .connect(db)
        .then(() => console.log('MongoDB connected'))
        .catch((err) =>
        {   
            res.status(400).json({error:"error while connecting to mongoDb" })

            console.log("error while connecting to mongoDb\t"+err)
        });

app.get('/', (req, res) => res.send('hello World'));


//Passport config
require('./config/passport')(passport);

//Passport middleware
app.use(passport.initialize()) ;


//Use Routes
app.use('/api/users',auth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/error', error);


//custom error handling middleware
//error handling means - catching the error and then doing anything with or without it.
//this will catch all the errors thrown and not caught by try catch or by any other middleware earlier in the pipeline and all catch the errors invoked via next(error).
//so we can either use try catch or call next(error) to invoke error middleware for error handling
app.use(function(error, req, res, next){
    console.log("unhandled error detected " + error);
    throw error;
    //res.send('500- server error');
});

//this middleware will handle all the other requests
app.use("/",function(req, res){
    res.status(404).send("404 - Page not found.");
})

//export to be able to redirect to error page from any route. 
//Yet to create error page in React 
//see use in posts.1.js file
export {app};

//run the SERVER on 4000.
const port = process.env.PORT || 4000 ;

app.listen(port, () => console.log('app listening at port ' + port));
