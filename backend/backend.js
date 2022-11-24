const groups = [];
const users = [];

class User {
  constructor(email, username, password){
    // check mail and username
    if(User.doesEmailExist(email))
      throw new Error('Email exists.');
    if(User.doesUsernameExist(username))
      throw new Error('Username exists.');

    //create unique id
    do{
      this.id = new Date().getTime() + Math.floor((Math.random() * 100));
      this.id = this.id.toString();
    }while(users.some(u => u.id === this.id));

    //
    this.email = email;
    this.username = username;
    this.password = password; 
    this.groupCode = '0';
    this.verified = false;
  }

  joinGroup(groupCode){
    groups.find((g) => g.code === groupCode).addMember(this);
  }

  leaveGroup(){
    if(this.groupCode === '0')
      throw new Error('User is not in a group');
    
    groups.find((g) => g.code === this.groupCode).discardMember(this);
  }

  static doesEmailExist(email){
    return users.some(u => u.email === email);
  }

  static doesUsernameExist(username){
    return users.some(u => u.username === username);
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

  static makeGroupCode(length = 4) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < length; ++i) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
  }

  static checkSize(size){
    return true;  //todo check the size.
  }
}

  //users.push(new User('erkutmail', 'erkut', 'erkut123'));
  users.push(new User('boranmail', 'boran', 'boran123'));
  users.push(new User('batuhanmail', 'batuhan' ,'batuhan123'));
  users.push(new User('kadirmail', 'kadir', 'kadir123'));
  users.push(new User('enesmail', 'enes', 'enes123'));

g1 = new Group(users[0], 2);
g2 = new Group(users[1], 3);

groups.push(g1);
groups.push(g2);

console.log(groups);
console.log('======================================================================================');
users[0].leaveGroup();
console.log(groups);

module.exports = {users, groups, User, Group};