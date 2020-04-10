class Validate{

  message = '';

  getMessage(){
    return this.message;
  }

  validateMinLength(str, length){
    return !!str && `${ str }`.length >= length;
  }

  validatePassword(password){
    let result = true
    , {
      minimumPasswordLength,
      enableStrongPassword
    } = config.user.registration;

    if (true === enableStrongPassword){
      if (this.validateMinLength(password, minimumPasswordLength)){
        if (
          !password.match(/[\W]/g) || 
          !password.match(/[\d]/g) || 
          !password.match(/[\w]/g)
        ){
          result = false;
          this.message = langs.get('error_password_stronger');
        }
      }
      else{
        result = false;
        this.message = langs.get('error_password_length');
      }
    }
    else if (minimumPasswordLength > 0){
      if (!this.validateMinLength(password, minimumPasswordLength)){
        result = false;
        this.message = langs.get('error_password_length');
      }
    }

    return result;
  }

  validateEmail(email){
    let result = true;

    if (this.validateMinLength(email, 1)){
      if (!email.match(/^[a-z\d]+[a-z\d\-\._]*[a-z\d]+@([a-z\d\-]+\.){1,2}[a-z]{2,}$/gi)){
        result = false;
        this.message = langs.get('error_email_format');
      }
    }
    else{
      result = false;
      this.message = langs.get('error_email_length');
    }

    return result;
  }

  validatePhone(phone){
    let result = true;

    if (this.validateMinLength(phone, 1)){
      let { enable, format, modifier } = config.user.registration.validatePhone;

      if (true === enable && format.constructor === String){
        try{
          if (!phone.match(new RegExp(format, modifier))){
            result = false;
            this.message = langs.get('error_phone_format');
          }
        }
        catch(e){}
      }
    }
    else{
      result = false;
      this.message = langs.get('error_phone_length');
    }

    return result;
  }

}

module.exports = new Validate;