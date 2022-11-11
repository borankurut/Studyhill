class User {
  constructor(id, email, username, password, groupCode){
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password; 
    this.groupCode = groupCode;
  }
}

class Group {
  constructor(admin, maxSize, code){  // todo: make the code randomly generated and unique.
    this.admin = admin;
    this.members = [admin];
    this.code =code;
    this.maxSize = maxSize;
  }
  
  get size() {return this.members.length;}

  addMember(user){
    if(user.groupCode != '0')
      throw new Error('User is already in the group');  // same or different.

    if(this.size < this.maxSize){
      this.members.push(user);
      user.groupCode = this.code;
    }
    else 
      throw new Error('Group is full.');
  }
  
  discardMember(user){        // todo: handle when group size is 0
    if(!this.members.includes(user))
      throw new Error('User is not in the group');
      
    this.members = this.members.filter((member) => member != user);

    if(user.id === this.admin.id && this.size > 0) // user is admin and there are members
      this.admin = this.members[0];   // make the next user admin

    user.groupCode = '0';
  }
}

const users = [
  new User('1', 'erkutmail', 'erkut', 'erkut123', '0'),
  new User('2', 'boranmail', 'boran', 'boran123', '0'),
  new User('3', 'batuhanmail', 'batuhan' ,'batuhan123', '0'),
  new User('4', 'kadirmail', 'kadir', 'kadir123', '0'),
  new User('5', 'enesmail', 'enes', 'enes123', '0')
];

g1 = new Group(users[0], 2, 'codeG1');
g2 = new Group(users[4], 3, 'codeG2');

//console.log(g1, g2);

g1.addMember(users[1]);
//g1.addMember(users[2]);
//g1.addMember(users[1]);   
//console.log(g1, g2);

g1.discardMember(users[0]);
//g1.discardMember(users[3]);
console.log(g1);

module.exports = {users, User, Group};
