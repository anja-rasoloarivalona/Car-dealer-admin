export const validator = (email, password, confirm_password, firstName, lastName) => {
    const error = [];


    let values = [email, password, confirm_password, firstName, lastName];


    /* ------CHECK IF VALUE IS EMPTY---------*/
    
    values.forEach(val => {
        if(val){
            if(val.value.length < 1){
                error.push(`${val.errorLabel} is required`)
            }
        }
    })


    /*-------CHECK IF EMAIL IS VALID--------*/
    let emailIsValid = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email.value.trim())
      if(!emailIsValid){
        error.push('Please, enter a valid email')
      }


      /*----CHECK FIRST NAME AND LAST NAME LLENGTH------*/ 
      if(firstName){
          if(firstName.value.trim().length < 3){
              error.push('Firstname should be at least 3 characters long')
          }
      }

      if(lastName){
        if(lastName.value.trim().length < 3){
            error.push('Lastname should be at least 3 characters long')
        }
    }


    /*------CHECK PASSWORD LENGTH-----*/
    if(password.value.trim().length < 5) {
        error.push('Password should be at least 5 characters long')
    }

    /*----CHECK IF TWO PASSWORDS ARE EQUAL-----*/
    if(confirm_password){
        if(password.value.trim() !== confirm_password.value.trim()){
            error.push('Please enter the same password')
        }
    }

    return error
}