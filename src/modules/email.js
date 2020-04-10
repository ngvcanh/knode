const SendGrid = require('@sendgrid/mail');
const pug = require('pug');
const path = require('path');
const fs = require('fs');

class Email{

  template = '';

  from = '';

  html = '';

  subject = '';

  text = '';

  options = {};

  constructor(template){
    this.setApiKey();
    this.setTemplate(template);
    this.setFrom();
  }

  setApiKey(){
    SendGrid.setApiKey(config.mailer.sendgrid.apikey);
  }

  setTemplate(template){
    this.template = template;
  }

  setFrom(from){
    this.from = from ? from : config.mailer.smtp.from;
  }

  loadTemplate(data){
    let pathTemplate = path.join(config.application.root, '..', config.mailer.locals.directory);

    ['html', 'subject', 'text'].map(fileName => {
      let fullPath = path.join(pathTemplate, this.template, fileName + '.' + config.mailer.locals.extension);

      if (fs.existsSync(fullPath)){
        const compiledFunction = pug.compileFile(fullPath);
        this[fileName] = compiledFunction(data);
      }
    });

  }

  createOptions(){
    this.options.from = this.from;
    this.options.subject = this.subject;
    this.options.text = this.text;
    this.options.html = this.html;
  }

  send(to, locals){
    this.options.to = to;
    this.loadTemplate(locals);
    this.createOptions();
    SendGrid.send(this.options).catch(e => {console.log(e)});
  }

}

module.exports = Email;