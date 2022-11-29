const express = require("express");

const app = express();

const path = require("path");

const {users, groups, Group, User} = require("./userAndGroup.js");

const {logger} = require("./logger.js");

const {sendVerificationMail,decodeRegistrationToken} = require("./mailVerification");
const {cryptPassword, comparePassword} = require("./encodeAndDecode");

const port = 3001;

//Kadir MySQL - Start

const mysql = require("mysql");

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'snow-login'
});

db.connect( (error) => {
  if(error) {
    console.log(error);
  } else {
    console.log("MySQL connected...");
  }
});

//Kadir MySQL - Finish

app.use(logger);

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// app.get('/', (req, res) => {
//   return res.json({
//     'users': users,
//     'groups': groups});
// })

app.get("/api", (req, res) => {
  return res.json({ users: ["Erkut", "Batuhan", "Boran", "Enes", "Kadir"] });
});

app.post('/', async (req, res) => {
  const {email, password} = req.body;

  if(!email || !password)
    return res.status(400).send('please provide');  // username or password empty.

  const user = users.find((u) => u.email === email);

  if(user && await comparePassword(password, user.password)){ // user found and pass is valid.
      if(user.verified) 
        return res.status(200).send('valid');
      else 
        return res.status(200).send('please verify your account.');
    }
  else // user not found or password is not valid.
    return res.status(400).send('Username or password is not valid.');
})


app.put('/signup', async (req, res) => {
  const {email, username, password, passwordAgain} = req.body;

  if(password !== passwordAgain)      // passwords not match
    return res.status(400).send('passwords do not match.'); 

  try{
    const user = new User(email, username, await cryptPassword(password));
    users.push(user);
    sendVerificationMail(user);
    return res.status(200).send('Waiting verification.');
  }
  catch(e){ // email exists or username exists.
    return res.status(403).send(e.toString());
  }
})

app.get("/verify", function (req, res) {
  try {
    const token = req.query.id;
    const { userId, expired } = decodeRegistrationToken(token); // decode the given url to find user id.
    if (expired) {
      console.log("expired");
      throw new Error("this verification link is expired.");
    }
    users.find((u) => u.id === userId).verified = true; // make the user verified.
    return res.status(200).send("verified.");
  } catch (e) {
    return res.status(400).send(e.toString());
  }
});

app.put("/joingroup", (req, res) => {
  const { id, groupCode } = req.body;
  const toJoin = groups.find((g) => g.code === groupCode);
  if (!toJoin) return res.status(400).send("Invalid Code");

  const user = users.find((u) => u.id === id);

  if (!user) return res.status(400).send("Invalid id");

  user.joinGroup(toJoin.code);

  return res.status(200).send("added");
});

app.put("/creategroup", (req, res) => {
  const { id, maxSize } = req.body;

  const user = users.find((u) => u.id === id);
  if (!user) return res.status(400).send("Id is not valid.");

  if (maxSize < 2 || maxSize > 8)
    return res.status(400).send("size is not valid");

  groups.push(new Group(user, maxSize));
  return res.status(200).send("created");
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
