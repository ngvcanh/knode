Date.prototype.getDatetime = function(fullZero = true){
  let year = this.getFullYear()
  , month = this.getMonth() + 1
  , day = this.getDate()
  , hour = this.getHours()
  , minute = this.getMinutes()
  , second = this.getSeconds();

  if (true === fullZero){
    month  < 10 && (month = `0${ month }`);
    day  < 10 && (day = `0${ day }`);
    hour  < 10 && (hour = `0${ hour }`);
    minute  < 10 && (minute = `0${ minute }`);
    second  < 10 && (second = `0${ second }`);
  }

  return [ [ year, month, day ].join('-'), [ hour, minute, second ].join(':') ].join(' ');
};

Array.prototype.contain = function(element){
  return !!~this.indexOf(element);
};


global.Array = Array;
global.Date = Date;

global.handleError = err => {console.log(err);};

global.langs = require('./modules/language');
global.Mongo = require('./modules/mongo');
global.Token = require('./modules/token');