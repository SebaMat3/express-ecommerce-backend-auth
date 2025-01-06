const jwt = require('jsonwebtoken');
const secret = "myCat";
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInNjb3BlIjoiIiwiaWF0IjoxNzM2MTEzMTQ2fQ.W2BOZ5nh03uYqeY2mQ6Kja3La8T88nzTYLrL1ShObHE';

function verifyToken (token, secret) {
	return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);
console.log(payload);
