const express = require('express');
const mongoose = require('mongoose');

const app = express();

const db = require('./config/keys').mongoURI ;


const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose
    .connect(db)
        .then(() => console.log('MongoDB connected'))
        .catch((err) => console.log("error while connecting to mongoDb\t"+err));

app.get('/', (req, res) => res.send('hello World'));

//Use Routes

app.use('/api/users',auth);
app.use('/api/profile', profile);


//run the SERVER on 4000.

const port = process.env.PORT || 4000 ;

app.listen(port, () => console.log('app listening at port 4000'));
