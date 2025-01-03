//pass-verify.js
const bcrypt = require('bcrypt');

async function verifyPassword() {
  const myPassword = 'admin1.2.3';
  const hash = '$2b$10$QHjx0m1CG5LJEuGhiRq5qeLsXBgqw9HLl0/coE4zJGEsOmDsKkEnK';
  const isMatch = await bcrypt.compare(myPassword, hash);
  console.log(isMatch);
}

verifyPassword();