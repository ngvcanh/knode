global.config = {

  // Config global server
  server : {
    port : 5000
  },

  // Config global application
  application : {
    production : false,
    showStraction : true,
    root : __dirname
  },

  // Config global api
  api : {
    pathname : 'api',
    version : '1.0',
    directory : 'api/v.1.0'
  },

  // Config global database
  database : {
    mongodb : {
      hostname : 'localhost',
      port : 27017,
      username : '',
      password : '',
      database : ''
    }
  },

  // Config global language
  language : {
    default : 'vn'
  },

  // Config global mailer
  mailer : {
    locals : {
      directory : 'email',
      extension : 'pug'
    },
    smtp : {
      from : ''
    },
    sendgrid : {
      apikey : ''
    }
  },
  
  // Config global user
  user : {
    registration : {
      enableVerification : true,
      enableStrongPassword : true,
      minimumPasswordLength : 6,
      saltRoundsPassword : 10,
      hashTextPassword : '',
      secretAccessToken : '',
      validatePhone : {
        enable : true,
        format : '^\\d{8,12}$',
        modifier : 'g'
      }
    }
  },

  pagination : {
    limit : 10,
    maxLimit : 100
  }

}