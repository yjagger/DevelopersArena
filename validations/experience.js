const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validateExperienceInput(data){
    let errors = [];

    data.title = !isEmpty(data.title) ? data.title : "" ;
    data.company = !isEmpty(data.company) ? data.company : "" ;
    data.location = !isEmpty(data.location) ? data.location : "" ;
    data.from = !isEmpty(data.from) ? data.from : "" ;


 
    if(Validator.isEmpty(data.title)){
        errors.push ({jobtitle :"title must be provided"});
    }
    if(Validator.isEmpty(data.company)){
        errors.push ({company :"company must be provided"});
    }
    if(Validator.isEmpty(data.from)){
        errors.push ({from :"start date must be provided"});
    }
    if(Validator.isEmpty(data.location)){
        errors.push ({location :"location must be provided"});
    }

    return {
        errors,
        isValid: !isEmpty(errors)
    }
}