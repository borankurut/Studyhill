const nm = require('nodemailer');
const emailValidator = require('deep-email-validator');

async function isEmailValid(email) {
  return emailValidator.validate(email)
}

function encodeRegistrationToken(user)
{
    // jsonweb automatically adds a key that determines the time, but you can use any module
    const jwt = require('jsonwebtoken');

    // The information we need to find our user in the database (not sensible info)
    let info = {id: user.id};

    // The hash we will be sending to the user
    const token = jwt.sign(info, "yoursecretkey");

    return token;
}

function decodeRegistrationToken(token)
{   
    const jwt = require('jsonwebtoken');
    let decoded = jwt.verify(token, "yoursecretkey");

    let userId = decoded.id;

    // Check that the user didn't take too long
    let dateNow = new Date();
    let tokenTime = decoded.iat * 1000;

    // Two hours
    let hours = 2;
    let tokenLife = hours * 60 * 1000;

    // User took too long to enter the code
    if (tokenTime + tokenLife < dateNow.getTime())
    {
        return {expired: true};
    }
    // User registered in time
    return {userId};
}

const transporter = nm.createTransport({
  service: "hotmail",
  auth:{
    user: "studyhilltestverification@outlook.com",
    pass: "p!!C*p.TFPu2-2@"
  },
  from: 'studyhilltestverification@outlook.com'
});

const SendVerificationMail = function(user){
  const url = 'http://localhost:3000/' + "verify?id=" + encodeRegistrationToken(user); // fix this later.
  transporter.sendMail(
    {from: 'studyhilltestverification@outlook.com', to: user.email, subject:'Studyhill mail verification',   //options
     text: `Please click this link to confirm your account: ${url}`},(err, info) => {
      if(err){
        console.log(err);
        return;
      }
      console.log('Sent: ' + info.response);
  });
}

module.exports = {SendVerificationMail, decodeRegistrationToken, isEmailValid};