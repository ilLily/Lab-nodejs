const jwt = require('jsonwebtoken');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTGlseSIsImlkIjoxMDAsImlhdCI6MTY4OTA0MDcyMH0.DxronkaL6-mkCHevrCn_MsvwrBoELI1VXr_52GO9InE';
const decoded = jwt.verify(token,'asdfjjj' );
console.log(decoded);