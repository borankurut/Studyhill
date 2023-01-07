const groups = [];
const users = [];

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

const {Task} = require('./task.js');

class User {
  constructor(email, username, password){
    this.email = email;
    this.username = username;
    this.password = password;
    this.groupCode = '0';
    this.verified = false;
    this.tasksData = [];
  }

  joinGroup(groupCode){
    groups.find((g) => g.code === groupCode).addMember(this);
  }

  leaveGroup(){
    if(this.groupCode === '0')
      throw new Error('User is not in a group');
    
    groups.find((g) => g.code === this.groupCode).discardMember(this);
  }

  addTask(taskname){
    const task = Task(taskname);
    this.tasksData.push(task);
  }

  get tasks(){
    this.tasksData = this.tasksData.filter(t => t.completed === false);
    return this.tasksData;
  }

  static doesEmailExist(email){
    return users.some(u => u.email === email);
  }

  static doesUsernameExist(username){
    return users.some(u => u.username === username);
  }

  static findUserEmail(email, callback){//find user with given email from db.
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, result) => {
        if(error)
          throw error;
        return callback(result[0]);
      });
  }

  static findUserId(id, callback){
    db.query(
      "SELECT * FROM users WHERE id = ?",
      [id],
      async (error, result) => {
        if(error)
          throw error;
        return callback(result[0]);
      });
  }

  static findUserUsername(username, callback){
    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (error, result) => {
        if(error)
          throw error;
        return callback(result[0]);
      });
  }

  static createWeeklyTable(id){
    const userId = id;
    const sql = `CREATE TABLE snowhill.weeklystudy_id_${userId}(`+
    `id_weeklystudy INT AUTO_INCREMENT,` +
    `monday INT NULL,`+
    `tuesday INT NULL,`+
    `wednesday INT NULL,`+
    `thursday INT NULL,`+
    `friday INT NULL,`+
    `saturday INT NULL,`+
    `sunday INT NULL,`+
    `date DATE NULL,`+
    `PRIMARY KEY (id_weeklystudy));`;
        
    db.query(sql, function (error, result){
      if(error)
      throw error;
    });
  }

  static weeklyDataOfDate(id, date, callback){ // date = 'yyyy-mm-dd'
    db.query(
      `SELECT * FROM weeklystudy_id_${id} WHERE date = ?`,
      [date],
      async (error, results) => {
        if(error)
          throw error;
        if(results[0] === null){  
          results[0] = ({monday: 0,tuesday: 0,wednesday: 0,thursday: 0,friday: 0,saturday: 0,sunday: 0});
        }
        callback(results[0]);
      }
    );
  }

  static allWeeklyHoursOfId(id, callback){
    db.query(
      `SELECT * FROM weeklystudy_id_${id}`,
      async (error, results) => {
        if(error)
          throw error;

        for(let i = 0; i < results.length; ++i){
          results[i].date = dateToStr(results[i].date);
          if(results[i] === null){  
            results[0] = {monday: 0,tuesday: 0,wednesday: 0,thursday: 0,
            friday: 0,saturday: 0,sunday: 0, date: result[i].date};
          }
          Object.keys(results[i]).forEach(
            (key) => {
              (results[i][key] === null) ? results[i][key] = 0 : results[i][key]
              if(key != 'date' && key != 'id_weeklystudy'){
                results[i][key] /= 60;
              }
            }
          );
        }
        callback(results);
      }
    );
  }

  static badgesOf(user){
    let badges = ["First Login"];
    if(user.badgeFirstStudy)
      badges.push("First Study");
    if(user.badgeHundredHours)
      badges.push("100 Hours");
    if(user.badgeGroupWinner)
      badges.push("Group Winner");
    
    return badges;
  }
}

class Group {
  constructor(maxSize, groupName, groupCode){ 
    this.maxSize = maxSize;
    this.groupName = groupName;
    this.groupCode = groupCode;
  }

  static createGroup(id, maxSize, groupName){
    let groupCode = Group.makeGroupCode();

    Group.findGroup(groupCode, function callback(g){
      if(g){
        createGroup(id, maxSize, groupName);
        return;
      }

      db.query("INSERT INTO snowhill.groups SET ?",
      {
        groupCode: groupCode,
        groupName: groupName,
        maxSize: maxSize,
        memberCount: 0,
        mondayDate: findLastMonday(new Date())
      },
      (error, results)=>{
        if(error){
          throw error;
        }
      })
    });
    const sql = `CREATE TABLE snowhill.group_table_code_${groupCode}(`+
    `id_group_table_code INT NOT NULL PRIMARY KEY AUTO_INCREMENT,` +
    'member_user_id INT,' +
    'studyTime INT,' +
    'username VARCHAR(255));';
        
    db.query(sql, function (error, result){
      if(error)
        throw error;
    });
    Group.addMember(groupCode, id); //adding the admin.
  }

  static addMember(groupCode, id){

    User.findUserId(id, function cb(u){
      db.query(`INSERT INTO snowhill.group_table_code_${groupCode} SET ?`,
      {
        member_user_id: u.id,
        studyTime: 0,
        username: u.username
        
      },function (error, result){
          if(error)
            throw error;
          Group.findGroup(groupCode, function cb(g) {
            let newCount = g.memberCount + 1;
            db.query(`UPDATE snowhill.groups SET memberCount = ${newCount} WHERE groupCode = "${groupCode}"`,
            (error, result) => {
              if(error)
                throw error;
              db.query(`UPDATE snowhill.users SET groupCode = "${groupCode}" WHERE id = ${u.id}`, 
              (error, result)=>{
                if(error) 
                  throw error;
              })
            })
        })
      })
    })
  }
  
  static discardMember(id){
    User.findUserId(id, function cb(u){
      db.query(`UPDATE users SET groupCode = '0' WHERE id = ${u.id}`, 
      (error, results)=>{if(error) throw error;});

      const sqlDelUserRow = `DELETE FROM snowhill.group_table_code_${u.groupCode} WHERE member_user_id = ${u.id};`;
      db.query(sqlDelUserRow, (error, results)=>{if(error) throw error;})

      Group.findGroup(u.groupCode, function cb(g) {
        let newCount = g.memberCount - 1;

        if(newCount === 0){
          // delete group from groups
          const sqlDelGroup = `DELETE FROM snowhill.groups WHERE groupCode = "${g.groupCode}";`; 
          db.query(sqlDelGroup, function cb(error, results){if(error) throw error;});

          // drop group table.
          const sqlDropTable = `DROP TABLE snowhill.group_table_code_${g.groupCode};`;
          db.query(sqlDropTable, function cb(error, results){if(error) throw error;});
        }

        else{
          db.query(`UPDATE snowhill.groups SET memberCount = ${newCount} WHERE groupCode = "${g.groupCode}"`,
          (error, results) => {if(error) throw error;});
        }
      });
    })
  }

  static makeGroupCode(length = 4) {
    let result = '';
    let characters = '0123456789abcdefghijklmnoprstuvyzwqx';
    for (let i = 0; i < length; ++i) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
  }

  static findGroup(groupCode, cb){
    console.log(groupCode);
    db.query("SELECT * FROM snowhill.groups WHERE groupCode = ?", [groupCode], 
    async (error, result) => {
      if(error)
        throw error;
      return cb(result[0]);
    })
  }
}

function dateToStr(d){
  const year = d.getFullYear();
  const month = d.getMonth() + 1; // Months start at 0!
  const day = d.getDate();

  return `${year}-${month}-${day}`;
}


function findLastMonday(date){
  let d = new Date(date);
  
  while(d.getDay() != 1)
    d.setDate(d.getDate() - 1);

  return dateToStr(d);
}

// weeklyDataOfDate('2022-12-12',function cb(date){
//   console.log(date);
//   console.log(date.id1_weeklystudy);
// });


// todo: studytime is gonna be added to the userTotal too.
function addStudyTime(id, date, studiedMinutes){
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  let lastMonday = findLastMonday(date);
  const currentDay = days[date.getDay()];

  console.log(lastMonday, currentDay, `toaddtime: ${studiedMinutes}`);  
  User.weeklyDataOfDate(id, lastMonday, function callback(weeklyData){
    if(weeklyData === undefined){
      db.query(`INSERT INTO weeklystudy_id_${id} SET ?`, { 
        date: lastMonday, [currentDay]:studiedMinutes}, (error, result)=>{
        if (error)
          throw error;
      });
    }
    else{
      currentTime = weeklyData[currentDay];
      if(currentTime === null)
        currentTime = studiedMinutes;
      else
        currentTime += studiedMinutes;

      User.findUserId(id, function callback(u){
        let total = u.totalStudyTime;
        total += studiedMinutes;
        const sql = `UPDATE snowhill.users SET totalStudyTime = ${total} WHERE id = ${u.id}; `+
        `UPDATE snowhill.users SET badgeFirstStudy = ${Number(total > 0)} WHERE id = ${u.id}; `+
        `UPDATE snowhill.users SET badgeHundredHours = ${Number(total >= 6000)} WHERE id = ${u.id}; `;

        db.query(sql, (error, result)=>{
          if(error)
            throw error;
        });
        if(u.groupCode != '0'){
          db.query(`SELECT * FROM snowhill.group_table_code_${u.groupCode} WHERE member_user_id = ${u.id}`,
          function callback(error, results){
            let studyTimeInGroup = results[0].studyTime + studiedMinutes;
            const sql = `UPDATE snowhill.group_table_code_${u.groupCode} `+
            `SET studyTime = ${studyTimeInGroup} WHERE member_user_id = ${u.id}`;
            db.query(sql, function cb(error, result){if(error) throw error;});
          })
        }

      });

      db.query(`UPDATE weeklystudy_id_${id} SET ${currentDay} = ${currentTime} WHERE date = ?`,
      [lastMonday], (error, results) =>{
        if(error)
          throw error;
      });

    }
  });
}

module.exports = {User, Group, addStudyTime, findLastMonday, dateToStr};