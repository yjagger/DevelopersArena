const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validateProfileInput(data){
    let errors = [];

    data.handle = !isEmpty(data.handle) ? data.handle : "" ;
    data.skills = !isEmpty(data.skills) ? data.skills : "" ;
    data.bio    = !isEmpty(data.bio) ? data.bio : "" ;
    data.status = !isEmpty(data.status) ? data.status : "" ;

    if(!Validator.isLength(data.handle, {min:3, max: 40})){
        errors.push({handleError: 'handle needs to be between 2 and 4 characters'});
            
    }
    if(Validator.isEmpty(data.handle)){
        errors.push ({handleError2: 'handle must not be empty' })
    }
    if(Validator.isEmpty(data.skills)){
        errors.push ({skills: 'skills must not be empty' })
    }
    if(Validator.isEmpty(data.bio)){
        errors.push ({ bio : 'bio must not be empty' })
    }
    if(Validator.isEmpty(data.status)){
        errors.push ({ status : 'status must not be empty' })
    }
    if(!isEmpty(data.website)){
        if(!Validator.isURL(data.website)){
            errors.push({websiteError: 'not a valid website'});
        }
    }
    if(!isEmpty(data.youtube)){
        if(!Validator.isURL(data.youtube)){
            errors.push({ youtubeUrlError: 'not a valid youtube URL'});
        }
    }
    if(!isEmpty(data.facebook)){
        if(!Validator.isURL(data.facebook)){
            errors.push({facebookUrlError: 'not a valid facebook URL'})
        }
    }
    if(!isEmpty(data.twitter)){
        if(!Validator.isURL(data.twitter)){
            errors.push({twitterUrlError : 'not a valid twitter URL'})
        }
    }
    if(!isEmpty(data.linkedin)){
        if(!Validator.isURL(data.linkedin)){
            errors.push({ linkedinUrlError: 'not a valid linkedIn URL'});
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}