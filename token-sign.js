const jwt = require('jsonwebtoken');

//This secret should always be saved as environment variable, kept hidden. This is an ilustrative example
const secret = "myCat";

//Payload is used to identify the owner of the token. `sub` attribute is required as a name or id, the rest are optional.
const payload = {
    sub: 1,
    role: '',

}

//This function, receiving payload and secret, generates a JWT
function signToken (payload, secret) {
    return jwt.sign(payload, secret);
}

//Generating the token inside a variable, using the function
const token = signToken(payload, secret);

console.log(token); // Output; eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInNjb3BlIjoiIiwiaWF0IjoxNzM2MTEzMTQ2fQ.W2BOZ5nh03uYqeY2mQ6Kja3La8T88nzTYLrL1ShObHE
