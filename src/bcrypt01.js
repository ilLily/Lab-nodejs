const bcrypt= require('bcryptjs');

const password = 'abc123';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
//$2a$10$sUa0Wj.DiV4wMO/4TfJhde7tzKGyiPeaA4BDp8RUVpQ9mlAO8PuMS