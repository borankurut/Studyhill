const nm = require('nodemailer');

const {encodeRegistrationToken, decodeRegistrationToken} = require('./encodeAndDecode.js');

const transporter = nm.createTransport({
  service: "hotmail",
  auth:{
    user: "studyhilltestverification@outlook.com",
    pass: "p!!C*p.TFPu2-2@"
  },
  from: 'studyhilltestverification@outlook.com'
});

const sendVerificationMail = function(user){
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
module.exports = {sendVerificationMail, decodeRegistrationToken, isEmailValid};
