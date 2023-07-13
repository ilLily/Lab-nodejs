const jwt = require('jsonwebtoken');

const token = jwt.sign({name:'Lily', id:100}, 'asdfjjj');
console.log(token);