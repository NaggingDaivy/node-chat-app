var moment = require('moment');

// var date = moment();

// date.add(1,'year');

// console.log(date.format('Do MMM YYYY'));

//10:35 am
// 6:01 am

var someTimestamp = moment().valueOf(); // new Date().getTime()
console.log(someTimestamp);

var createdAt = 1234;
var date = moment(createdAt);
console.log(date.format('h:mm a'));