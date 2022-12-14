const express = require("express");

const app = express();

const path = require("path");

const { Group, User , addStudyTime} = require("./userAndGroup.js");

const { logger } = require("./logger.js");

const {
  sendVerificationMail,
  decodeRegistrationToken,
} = require("./mailVerification");
const { cryptPassword, comparePassword } = require("./encodeAndDecode");

const port = 3001;

//Kadir MySQL - Start

const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "snowhill", //MySQL açık değilse burada hata verebilir. Bu satır comment edilirse hata gider.
});

db.connect((error) => {
  if (error) {
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

// cors library are required for communication between client
// server, which is port 3000, and backend server, port 3001.
const cors = require("cors");
app.use(cors());

const { dummy1, dummy2 } = require("./dummyUsers");

app.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  db.query(
    //todo: codes here are gonna be fixed after refactoring usersAndGroup.js
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
        return res.status(400).send(error.toString());
      }

      if (
        !results[0] ||
        !(await comparePassword(password, results[0].password))
      ) {
        // user not found
        return res.json({ verification: false });
      }

      const isUserVerified = results[0].verified;
      const username = results[0].username;

      // user found and pass is valid.  HARD CODED!!! FIX LATER!!!
      if (isUserVerified) {
        const toReturn = dummy2;
        toReturn.verification = true;
        toReturn.mailVerified = true;
        toReturn.username = username;
        return res.json(toReturn);
      } else
        return res.json({
          verification: true,
          mailVerified: false,
          username: username,
        });

      // user not found or password is not valid.
    }
  );
});

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email, username, password } = req.body;

  const user = new User(email, username, await cryptPassword(password));
  //mysql REGISTER

  db.query(
    //todo: codes here are gonna be fixed after refactoring usersAndGroup.js
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, result) => {
      if (error) {
        console.log(error);
        return res.status(400).send(error.toString());
      }

      if (result.length > 0) {
        return res.json({ alreadyExists: true });
      }

      db.query(
        "INSERT INTO users SET ?",
        {
          username: user.username,
          email: user.email,
          password: user.password,
          groupCode: user.groupCode,
          verified: user.verified,
          totalStudyTime: 0
        },
        (error, results) => {
          if (error) {
            console.log(error);
          }
        }
      );

      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (error, results) => {
          console.log(results[0].id);
          sendVerificationMail(user.email, results[0].id); // TODO: Fix mail address.
          //return res.status(200).send("Waiting verification.");
          return res.json({ foo: true });
        }
      );
    }
  );
});

app.get("/verify", function (req, res) {
  try {
    const token = req.query.id;
    const { userId, expired } = decodeRegistrationToken(token); // decode the given url to find user id.
    if (expired) {
      console.log("expired");
      throw new Error("this verification link is expired.");
    }

    db.query(
      "UPDATE users SET verified = 1 WHERE id = ?",
      [userId],
      (error, results) => {
        if (error) {
          console.log(error);
        }
      }
    );
    User.createWeeklyTable(userId);

    return res.status(200).send("verified.");
  } catch (e) {
    return res.status(400).send(e.toString());
  }
});

app.put("/joingroup", (req, res) => {
  const { id, groupCode } = req.body;
  const toJoin = groups.find((g) => g.code === groupCode);
  if (!toJoin) return res.status(400).send("Invalid Code"); // send message if eror.

  const user = users.find((u) => u.id === id);

  if (!user) return res.json({msg: "Invalid id"});

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

app.post("/check-already-login", async (req, res) => {
  // Print request body for debugging.
  console.log(req.body);
  const username = req.body.username;

  // device id is not checked currently for debug purposes.
  // the user found is returned.

  User.findUserUsername(username, async function callback(u){
    console.log(u);
    u.hasGroup = true;
    res.json(u);
  })
});

// Function get post method to logout user
// by simple removing unique device id from user
// and returns a simple information as response.
app.post("/logout", (req, res) => {
  // Printing request body for debugging
  console.log(req.body);

  // Remove unique device id from user
  // TODO

  // ----------------------- Important note -------------------------
  // We are sending in user data one unique device id to store all
  // devices logged in we must hold it in database as an array.

  // Send a response
  res.json({ deletedSuccesfully: true });
});

app.post("/addtime", (req, res) =>{
  console.log(req.body);
  
  let timeStudied = req.body.timeStudied;
  timeStudied *= 60;

  const id = req.body.id;

  addStudyTime(id, new Date(), timeStudied)
})

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});

