const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validateLoginInput(data){
    let errors = [];

    data.email = !isEmpty(data.email) ? data.email : "" ;
    data.password = !isEmpty(data.password) ? data.password : "" ;

    if(!Validator.isEmail(data.email)){
        errors.push({emailError  :"Email invalid"});
    }
    if(Validator.isEmpty(data.email)){
        errors.push({emailError2 :"Email must not be empty"});
    }

 
    if(Validator.isEmpty(data.password)){
        errors.push ({passwordError :"password must not be empty"});
    }

    return {
        errors,
        isValid: !isEmpty(errors)
    }
}