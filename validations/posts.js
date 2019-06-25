const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validatePostsInput(data){
    let errors = [];

    data.text = !isEmpty(data.text) ? data.text : "" ;
    data.password = !isEmpty(data.password) ? data.password : "" ;

    if(Validator.isEmpty(data.text)){
        errors.push({ postError : "Write something"});
    }

    if(!Validator.isLength(data.text, {min: 1, max: 300})){
        errors.push ({ postError2 : "Post should be max 300 characters long" });
    }

    return {
        errors,
        isValid: !isEmpty(errors)
    }
}