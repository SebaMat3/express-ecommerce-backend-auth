//pass-hash.js
const bcrypt = require('bcrypt');

async function hashPassword() {
  const myPassword = 'dont stop learning';
  const hash = await bcrypt.hash(myPassword, 10);
  console.log(hash);
}

hashPassword();