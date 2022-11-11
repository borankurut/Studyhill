const express = require('express');

const app = express();

const path = require('path');

const {users, Group, User} = require('./data.js');

const {logger} = require('./logger.js');

const port = 3000;

app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json(users);
})

app.post('/', (req, res) => {
  const {emailOrUsername, password} = req.body;
  
  console.log(emailOrUsername, password);

  if(!emailOrUsername || !password){
    res.status(401).send('please provide');
    return;
  }

  const valid = users.some((u) => 
  (u.email === emailOrUsername || u.username === emailOrUsername) 
  && u.password === password);

  if(valid)
    res.status(200).send('valid');
  else 
    res.status(401).redirect('/');
    
})

app.put('/signup', (req, res) => {
  const {email, username, password, passwordAgain} = req.body;
  if(password === passwordAgain) {// other checks
    users.push(new User((Number(users[users.length - 1].id) + 1).toString(), email, username, password, '0'));
    res.status(200).send('succesfully added');
  }
  else
    res.status(401).send('invalid arguments'); // other checks
})

app.listen(port, () =>{
  console.log('server is up');
});