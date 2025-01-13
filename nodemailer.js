// nodemailer.js
const nodemailer = require("nodemailer");
const {config} = require("./api/config/config");

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	auth: {
		user: config.adminEmail,
	  pass: config.emailPassword,
	}
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: config.adminEmail, // sender address
    to: config.adminEmail, // list of receivers
    subject: "Gmail Nodemailer testing ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

sendMail();