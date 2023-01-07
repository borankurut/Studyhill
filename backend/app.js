const express = require("express");

const app = express();

const path = require("path");

const { Group, User , addStudyTime, findLastMonday, dateToStr} = require("./userAndGroup.js");

const { logger } = require("./logger.js");

const {
  sendVerificationMail,
  decodeRegistrationToken,
} = require("./mailVerification");
const { cryptPassword, comparePassword, decodeTokenPassword, encodeTokenPassword } = require("./encodeAndDecode");

const port = 3001;

//Kadir MySQL - Start

const mysql = require("mysql");

const db = mysql.createConnection({
  host: "kadir-do-user-13247252-0.b.db.ondigitalocean.com",
  port: 25060,
  user: "doadmin",
  password: "AVNS_2hBscXeK1WeinW6uKJT",
  database: "snowhill", //MySQL açık değilse burada hata verebilir. Bu satır comment edilirse hata gider.
  multipleStatements: true
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

app.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  User.findUserEmail(email, async function cb(u){
    if (
      !u||
      !(await comparePassword(password, u.password))
    ) {
      // user not found
      return res.json({ verification: false });
    }
    addStudyTime(u.id, new Date(), 0);    // create that weeks table when user logged in.
    u.mailVerified = u.verified;           
    u.verification = true;

     // todo: this part is hardcoded here and in check-already part too
     // this part is gonna be linked to the database later.
    u.hasGroup = (u.groupCode !== '0');
    u.groupName = 'g1';
    u.tasks = ["t1", "t2"];
    u.badges = User.badgesOf(u);
    u.uniqeDeviceID = encodeTokenPassword(u.password);
    
    User.allWeeklyHoursOfId(u.id, function cb(wHours){
      u.weeklyHours = wHours;
      
      if(u.hasGroup){
        Group.findGroup(u.groupCode, function cb(g){
          u.groupName = g.groupName;

          if(findLastMonday(new Date()) != dateToStr(g.mondayDate)){
            //determine groupWinner
            const sqlLeaderboard = 
            `SELECT member_user_id FROM snowhill.group_table_code_${g.groupCode} ORDER BY studyTime DESC;`
            db.query(sqlLeaderboard, function cb(error, results){
              if(error) throw error;
              
              db.query(`UPDATE snowhill.users SET badgeGroupWinner = 1 WHERE id = ${results[0].member_user_id};`,
              (error, results)=>{if(error) throw error;})
            })

            const sqlUpdMonday = 
            `UPDATE snowhill.groups SET mondayDate = "${findLastMonday(new Date())}" `+
            `WHERE groupCode = "${g.groupCode}"`

            db.query(sqlUpdMonday, function cb(error, results){if(error) throw error;});

            const sqlResetTimes = 
            `UPDATE snowhill.group_table_code_${g.groupCode} SET studyTime = 0 `+
            `WHERE id_group_table_code > 0;`;
            db.query(sqlResetTimes, function cb(error, results){if(error) throw error;});
          }
          
          const sqlLeaderboard = 
          `SELECT username, studyTime FROM snowhill.group_table_code_${u.groupCode} ORDER BY studyTime DESC;`
          db.query(sqlLeaderboard, function cb(error, results){
            if(error) throw error; 
            u.leaderboard = results;
            return res.json(u);
          })
        })
      }
      else{
        return res.json(u);
      }
    })
  })
});

app.post("/check-already-login", (req, res) => {  // todo: deviceId part.
  // Print request body for debugging.
  console.log(req.body);
  const username = req.body.username;
  const uniqeDeviceID = req.body.uniqeDeviceID

  // device id is not checked currently for debug purposes.
  // the user found from username directly returned.

  User.findUserUsername(username, async function callback(u){
    if(u.password != decodeTokenPassword(uniqeDeviceID))
      return res.json({verification: false});
    addStudyTime(u.id, new Date(), 0);    // create that weeks table when user logged in.
    u.mailVerified = u.verified;
    u.verification = true;

     //hardcodded parts are necessery for frontend to work, 
     //they are gonna be changed after database implementation.
    u.hasGroup = (u.groupCode !== '0');
    u.groupName = 'g1';
    u.tasks = ["t1", "t2"];

    u.badges = User.badgesOf(u);
    
    User.allWeeklyHoursOfId(u.id, function cb(wHours){
      u.weeklyHours = wHours;
      
      if(u.hasGroup){
        Group.findGroup(u.groupCode, function cb(g){
          u.groupName = g.groupName;

          if(findLastMonday(new Date()) != dateToStr(g.mondayDate)){
            //determine groupWinner
            const sqlLeaderboard = 
            `SELECT member_user_id FROM snowhill.group_table_code_${g.groupCode} ORDER BY studyTime DESC;`
            db.query(sqlLeaderboard, function cb(error, results){
              if(error) throw error;
              
              db.query(`UPDATE snowhill.users SET badgeGroupWinner = 1 WHERE id = ${results[0].member_user_id};`,
              (error, results)=>{if(error) throw error;})
            })


            const sqlUpdMonday = 
            `UPDATE snowhill.groups SET mondayDate = "${findLastMonday(new Date())}" `+
            `WHERE groupCode = "${g.groupCode}"`

            db.query(sqlUpdMonday, function cb(error, results){if(error) throw error;});

            const sqlResetTimes = 
            `UPDATE snowhill.group_table_code_${g.groupCode} SET studyTime = 0 `+
            `WHERE id_group_table_code > 0;`;
            db.query(sqlResetTimes, function cb(error, results){if(error) throw error;});
          }

          const sqlLeaderboard = 
          `SELECT username, studyTime FROM snowhill.group_table_code_${u.groupCode} ORDER BY studyTime DESC;`
          db.query(sqlLeaderboard, function cb(error, results){
            if(error) throw error; 
            u.leaderboard = results;
            return res.json(u);
          })
        })
      }
      else{
        return res.json(u);
      }
    })
  })

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
        return res.json({msg: error.toString()});
      }

      if (result.length > 0) {
        return res.json({ alreadyExists: true });
      }
      User.findUserUsername(username, function cb(u){
      if(u)
        return res.json({alreadyExists: true});

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
          sendVerificationMail(user.email, results[0].id); 
          User.createWeeklyTable(results[0].id);
          return res.json({ msg: "Waiting verification."});
        }
      );
      })
    }
  );
});

app.get("/weekly-data-of", function(req, res){
  const {id} = req.body;
  User.allWeeklyHoursOfId(id, function callback(d){
    return res.json(d);
  });
})

app.get("/leaderboard-of", function(req, res){
  const {groupCode} = req.body;
  const sqlLeaderboard = 
  `SELECT username, studyTime FROM snowhill.group_table_code_${groupCode} ORDER BY studyTime DESC;`
  db.query(sqlLeaderboard, function cb(error, results){if(error) throw error; else return res.json(results);})
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

    return res.json({msg:'mail verified'});
  } catch (e) {
    return res.json({msg:e.toString()});
  }
});

app.put("/joingroup", (req, res) => {
  const { id, groupCode } = req.body;
  Group.findGroup(groupCode, function cb(g){
    if (!g) 
      return res.json({msg:"Invalid Code"}); // send message if eror.

    if(g.memberCount >= g.maxSize)
      return res.json({msg:"Group is full"});
    
    
    else{
        User.findUserId(id, function cb2(u){
          if(u.groupCode != '0')
            return res.json({msg:"User is already in a group."});
          else{
            Group.addMember(g.groupCode, id);
            return res.json({msg: "Added"});
          }
        })
    }
  });
});

app.put("/leavegroup", (req, res) => {
  const {id} = req.body;

  try{
    Group.discardMember(id);
    res.json({msg:"Leaved"});
  }
  catch(e){
    res.json(e.toString());
  }
});

app.put("/creategroup", (req, res) => {
  const { id, maxSize, groupName } = req.body;
  console.log(req.body);

  if (maxSize < 2 || maxSize > 8)
    return res.json({msg: "size is not valid"});

  User.findUserId(id, function cb(u){
    if (!u) return res.json({msg: "Invalid id"});

    Group.createGroup(id, maxSize, groupName);
    return res.json({msg: "created"});
  });

});

app.post("/logout", (req, res) => {
  res.json({ deletedSuccesfully: true });
});

app.post("/addtime", (req, res) =>{
  console.log(req.body);
  
  let timeStudied = req.body.timeStudied;
  timeStudied *= 60;

  const id = req.body.id;

  addStudyTime(id, new Date(), timeStudied)
})

app.post("/change-weeklygoal", (req, res) => {
  console.log(req.body);
  let toChangeId = req.body.id;
  let newWeeklyGoal = req.body.weeklyGoal;
  db.query(`UPDATE snowhill.users SET weeklyGoal = ${newWeeklyGoal} WHERE id = ${toChangeId}`, 
  (error, results)=>{if(error) throw error;});
  res.send({msg: 'updated'});
})

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});