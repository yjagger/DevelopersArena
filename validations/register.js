const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validateRegisterInput(data){
    let errors = [];

    data.name = !isEmpty(data.name) ? data.name : "" ;
    data.email = !isEmpty(data.email) ? data.email : "" ;
    data.password = !isEmpty(data.password) ? data.password : "" ;
    data.password2 = !isEmpty(data.password) ? data.password2 : "" ;


    if(!Validator.isLength(data.name, {min: 2, max: 30})){
        errors.push({nameError1: "Name must be between 2 and 30 characters"});
    }
    if(Validator.isEmpty(data.name)){
        errors.push({nameError2 :"Name must not be empty"});
    }
    if(!Validator.isEmail(data.email)){
        errors.push({emailError :"Email is not correct"});
    }
    if(Validator.isEmpty(data.email)){
        errors.push({emailError2 :"Email must not be empty"});
    }
    if(!Validator.isLength(data.password,{min: 6, max : 14})){
        errors.push({passwordError :"password must be between 6 and 14 characters long"});
    }
    if(Validator.isEmpty(data.password)){
        errors.push ({passwordError2 :"password must not be empty"});
    }
    if(Validator.isEmpty(data.password2)){
        errors.push({passwordError3 :"confirmed password must not be empty"});
    }
    if(!Validator.equals(data.password, data.password2)){
        errors.push({passwordError4 :"passwords must match"});
    }
    
    console.log("password is "+ data.password);


    return {
        errors,
        isValid: !isEmpty(errors)
    }
}