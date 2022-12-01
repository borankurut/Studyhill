const express = require("express");

const app = express();

const path = require("path");

const { users, groups, Group, User } = require("./userAndGroup.js");

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

app.get("/", (req, res) => {
  return res.json({
    users: users,
    groups: groups,
  });
});

app.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send("please provide"); // username or password empty.

  //const user = users.find((u) => u.email === email);
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
        return res.status(400).send(error.toString());
      }

      if (
        !results[0] ||
        (await !comparePassword(password, results[0].password))
      ) {
        // user not found
        return res.status(400).send("Username or password is not valid.");
      }
      const isUserVerified = results[0].verified;

      // user found and pass is valid.
      if (isUserVerified) return res.status(200).send("valid");
      else return res.status(200).send("please verify your account.");

      // user not found or password is not valid.
    }
  );
});

app.put("/signup", async (req, res) => {
  const { email, username, password, passwordAgain } = req.body;

  if (password !== passwordAgain)
    // passwords not match
    return res.status(400).send("passwords do not match.");

  const user = new User(email, username, await cryptPassword(password));
  //users.push(user);
  //mysql REGISTER

  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, result) => {
      if (error) {
        console.log(error);
        return res.status(400).send(error.toString());
      }

      if (result.length > 0) {
        return res.status(400).send("Email is already in use!");
      }

      db.query(
        "INSERT INTO users SET ?",
        {
          username: user.username,
          email: user.email,
          password: user.password,
          groupCode: user.groupCode,
          verified: user.verified,
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
          return res.status(200).send("Waiting verification.");
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

    //users.find((u) => u.id === userId).verified = true; // make the user verified.

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

//============================================================================

/*
 *
 * ███████╗████████╗██╗   ██╗██████╗
 * ██╔════╝╚══██╔══╝██║   ██║██╔══██╗
 * ███████╗   ██║   ██║   ██║██████╔╝
 * ╚════██║   ██║   ██║   ██║██╔══██╗
 * ███████║   ██║   ╚██████╔╝██████╔╝
 * ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝
 *
 * Login Post method will be handled by this function. But for now
 * its is here to just debugging front-end login page.
 *
 */

app.post("/login", (req, res) => {
  // Print request body for debugging.
  console.log(req.body);

  // There must be some checking that whether email given exists
  // or not, which is job of backend, that i will skip for now.
  // _________ _______  ______   _______
  // \__   __/(  ___  )(  __  \ (  ___  )
  //    ) (   | (   ) || (  \  )| (   ) |
  //    | |   | |   | || |   ) || |   | |
  //    | |   | |   | || |   | || |   | |
  //    | |   | |   | || |   ) || |   | |
  //    | |   | (___) || (__/  )| (___) |
  //    )_(   (_______)(______/ (_______)

  // Returning response to client
  // -----------------------------
  // An object that has informations of the user, if that user exists,
  // and verification value, that can be eighter true or false.
  // Front-end will process respect to the verification.
  // If verification is true, then client will been navigate to profile page.
  // Else there will be an alert that there is no such user exists to client
  const user = {
    verification: true,
    username: "KaraMurat",
    hasGroup: false,
    groupName: "",
    tasks: [
      "Study Software Engineering lecture for 2 hours",
      "Read a book for 1 hour",
    ],
    weeklyGoal: 5,
    weeklyHours: {
      monday: 4,
      tuesday: 3,
      wednesday: 5,
      thursday: 3,
      friday: 6,
      saturday: 4,
      sunday: 1,
    },
    badgesEarned: ["badge1", "badge2", "badge3", "badge4"],
    // A unique id for each devices to remember login.
    // This id will be stored in local store. In home page request if
    // unique id of this device for the username (request will be
    // sent with username)
    // correct, then user will login automatically.
    uniqeDeviceID: "ASDFA0000FDF1223",
  }; // These are what i remember. Of course we can add more information to send
  res.json(user); // Send user in JSON format as response to client.
});

// If there is stored username and devicedID, then client post this values
// as an object to server to check whether this username exist or not.
// And gets a response that consists of data of the user.
app.post("/check-already-login", (req, res) => {
  // Print request body for debugging.
  console.log(req.body);

  // Checking uniqueDeviceID and username
  // _________ _______  ______   _______
  // \__   __/(  ___  )(  __  \ (  ___  )
  //    ) (   | (   ) || (  \  )| (   ) |
  //    | |   | |   | || |   ) || |   | |
  //    | |   | |   | || |   | || |   | |
  //    | |   | |   | || |   ) || |   | |
  //    | |   | (___) || (__/  )| (___) |
  //    )_(   (_______)(______/ (_______)

  // The rest same as login post
  const user = {
    verification: true,
    username: "KaraMurat",
    hasGroup: false,
    groupName: "",
    tasks: [
      "Study Software Engineering lecture for 2 hours",
      "Read a book for 1 hour",
    ],
    weeklyGoal: 5,
    weeklyHours: {
      monday: 4,
      tuesday: 3,
      wednesday: 5,
      thursday: 3,
      friday: 6,
      saturday: 4,
      sunday: 1,
    },
    badgesEarned: ["badge1", "badge2", "badge3", "badge4"],
    uniqeDeviceID: "ASDFA0000FDF1223",
  };
  res.json(user);
});

//============================================================================

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
