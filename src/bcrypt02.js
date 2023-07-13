const bcrypt = require('bcryptjs');

const password = 'abc123';
const hash = '$2a$10$sUa0Wj.DiV4wMO/4TfJhde7tzKGyiPeaA4BDp8RUVpQ9mlAO8PuMS'

const result = bcrypt.compareSync(password,hash)
console.log(result);