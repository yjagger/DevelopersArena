const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema

const profileSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users' //refers to collection
    },
    handle: {
        type: String,
        required: true,
        max: 40
    },
    company: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    location : {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    skills:{
        type: [String],
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    githubusername: {
        type: String,
        required: false
    },
    experiences : [{
        title: {
            type: String,
            required : true
        },
        company: {
            type: String,
            required : true
        },
        location: {
            type: String,
            required: true
        },
        from: {
            type: Date,
            required: true
        },
        to : {
            type: Date,
            required: false
        },
        current: {
            type: Boolean,
            default: false
        },
        description : {
            type: String,
            required: false
        }
    }],
    education : [
        {  
        degree: {
            type: String,
            required : true
            },
        majors:{
            type: String,
            required: true
            },
        school: {
            type: String,
            required: true
            },
        from: {
            type: Date,
            required: true
            },
        to : {
            type: Date,
            required: false
            },
        current: {
            type: Boolean,
            default: false
            },
        area : {
            type: String,
            required: false
            },
        description:{
            type: String
        }
        }],
    social: {
        youtube: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        },
        twitter: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = profile = mongoose.model('profile', profileSchema);