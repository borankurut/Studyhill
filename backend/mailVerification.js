const nm = require('nodemailer');

const {encodeRegistrationToken, decodeRegistrationToken} = require('./encodeAndDecode.js');

const transporter = nm.createTransport({
  service: "gmail",
  auth:{
    user: "studyhillmail@gmail.com",
    pass: "thgvmbvbnofpoxtz"
  },
  from: 'studyhillmail@gmail.com'
});

const sendVerificationMail = function(userMail,userID){
  const url = 'http://165.232.66.125:3001/api/' + "verify?id=" + encodeRegistrationToken(userID); // fix this later.
  transporter.sendMail(
    {from: 'studyhillmail@gmail.com', to: userMail, subject:'Studyhill mail verification',   //options
     text: `Please click this link to confirm your account: ${url}`},(err, info) => {
      if(err){
        console.log(err);
        return;
      }
      console.log('Sent: ' + info.response);
  });
}
module.exports = {sendVerificationMail, decodeRegistrationToken};
