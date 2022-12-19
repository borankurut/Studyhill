const groups = [];
const users = [];

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
}

class Group {
  constructor(admin, maxSize){ 
    this.admin = admin;
    this.members = [];
    this.maxSize = maxSize;
    do{  
      this.code = Group.makeGroupCode();
    }
    while(groups.some(g => g.code === this.code));

    this.addMember(admin);
  }
  
  get size() {return this.members.length;}

  addMember(user){
    if(user.groupCode != '0')
      throw new Error('User is already in a group');  // same or different.

    if(this.size < this.maxSize){
      this.members.push(user);
      user.groupCode = this.code;
    }
    else 
      throw new Error('Group is full.');
  }
  
  discardMember(user){  // todo: fix me.
    if(!this.members.includes(user))
      throw new Error('User is not in the group');
      
    this.members = this.members.filter((member) => member != user);

    if(user.id === this.admin.id && this.size > 0) // user is admin and there are members
      this.admin = this.members[0];   // make the next user admin

    user.groupCode = '0';

    // if group is empty delete it.
    if(this.size === 0){
      const ix = groups.indexOf(groups.find(g => g.code === this.code));
      groups.splice(ix, 1);
    }
  }

  static makeGroupCode(length = 6) {
    let result = '';
    let characters = '0123456789';
    for (let i = 0; i < length; ++i) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
  }

  static checkSize(size){
    return true;  //todo check the size.
  }
}

// User.findUserEmail("borankurut@gmail.com", function callback(user){
//   console.log(user);
//   printMe = `member_${user.id}`;
//   console.log(printMe);
// })

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
        total += currentTime;

        db.query(`UPDATE users SET totalStudyTime = ${total} WHERE id = ${u.id}`, (error, result)=>{
          console.log(u.id);
          if(error)
            throw error;
        });

      });

      db.query(`UPDATE weeklystudy_id_${id} SET ${currentDay} = ${currentTime} WHERE date = ?`,
      [lastMonday], (error, results) =>{
        if(error)
          throw error;
      });

      console.log('currentTime31 ', currentTime);
    }
  });
}

module.exports = {User, Group, addStudyTime, findLastMonday};