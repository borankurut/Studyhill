const express = require('express');

const app = express();

const path = require('path');

const {users, groups, Group, User} = require('./userAndGroup.js');

const {logger} = require('./logger.js');

const {sendVerificationMail, decodeRegistrationToken, isEmailValid} = require('./mailVerification');
const {encodePassword, decodePassword} = require('./encodeAndDecode');

const port = 3000;

app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.get('/', (req, res) => {
  return res.json({
    'users': users,
    'groups': groups});
})

app.post('/', (req, res) => {
  const {emailOrUsername, password} = req.body;

  if(!emailOrUsername || !password)
    return res.status(400).send('please provide');  // username or password empty.

  const user = users.find((u) => 
  (u.email === emailOrUsername || u.username === emailOrUsername) 
  && decodePassword(u.password) === password);  // find user matches the input.

  if(user){ // user found.
      if(user.verified) 
        return res.status(200).send('valid');
      else 
        return res.status(200).send('please verify your account.');
    }
  else // user not found.
    return res.status(400).send('Username or password is not valid.');
})

app.put('/signup', async (req, res) => {
  const {email, username, password, passwordAgain} = req.body;

  if(password !== passwordAgain)      // passwords not match
    return res.status(400).send('passwords not match.'); 

  if (!valid)
      return res.status(400).send({      // email adress is not valid.
      message: "Please provide a valid email address.",
      reason: validators[reason].reason});

  try{
    const user = new User(email, username, encodePassword(password));
    users.push(user);
    sendVerificationMail(user);
    return res.status(200).send('Waiting verification.');
  }
  catch(e){ // email exists or username exists.
    return res.status(403).send(e.toString());
  }
})

app.get('/verify', function(req, res) {
  try{
    const token = req.query.id;
    const {userId, expired} = decodeRegistrationToken(token);  // decode the given url to find user id.
    if(expired){
      console.log('expired');
      throw new Error('this verification link is expired.');
    }
    users.find(u => u.id === userId).verified = true; // make the user verified.
    return res.status(200).send('verified.');
  }
  catch(e){
    return res.status(400).send(e.toString());
  }
});

app.put('/joingroup', (req, res) =>{
  const {id, groupCode} = req.body;
  const toJoin = groups.find((g) => g.code === groupCode);
  if(!toJoin)
    return res.status(400).send('Invalid Code');
  
  const user = users.find((u) => u.id === id);

  if(!user)
    return res.status(400).send('Invalid id');
  
  user.joinGroup(toJoin.code);

  return res.status(200).send('added');
})


app.put('/creategroup', (req, res) =>{
  const {id, maxSize} = req.body;

  const user = users.find(u => u.id === id);
  if(!user)
    return res.status(400).send('Id is not valid.');
  
  if(maxSize < 2 || maxSize > 8)
    return res.status(400).send('size is not valid');

  groups.push(new Group(user, maxSize));
  return res.status(200).send('created');
})

//todo: necessery functions are gonna be async.

app.listen(port, () =>{
  console.log('server is up');
});
