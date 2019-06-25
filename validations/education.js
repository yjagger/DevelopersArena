const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validateeducationinput(data){
    let errors = [];

    data.school = !isEmpty(data.school) ? data.school : "" ;
    data.degree = !isEmpty(data.degree) ? data.degree : "" ;
    data.majors = !isEmpty(data.majors) ? data.majors : "" ;
    data.from = !isEmpty(data.from) ? data.from : "" ;


 
    if(Validator.isEmpty(data.degree)){
        errors.push ({jobdegree :"degree must be provided"});
    }
    if(Validator.isEmpty(data.majors)){
        errors.push ({majors :"majors must be provided"});
    }
    if(Validator.isEmpty(data.school)){
        errors.push ({school :"start date must be provided"});
    }
    if(Validator.isEmpty(data.from)){
        errors.push ({from :"from must be provided"});
    }

    return {
        errors,
        isValid: !isEmpty(errors)
    }
}