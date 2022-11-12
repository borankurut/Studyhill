const groups = [];
const users = [];

class User {
  constructor(email, username, password, groupCode){
    do{
      this.id = new Date().getTime() + Math.floor((Math.random() * 100));
      this.id = this.id.toString();
    }while(users.some(u => u.id === this.id));
    this.email = email;
    this.username = username;
    this.password = password; 
    this.groupCode = groupCode;
  }

  joinGroup(groupCode){
    groups.find((g) => g.code === groupCode).addMember(this);
  }

  leaveGroup(){
    if(this.groupCode === '0')
      throw new Error('leaveGroup(): User is not in a group');
    
    groups.find((g) => g.code === this.groupCode).discardMember(this);
  }
}

class Group {
  constructor(admin, maxSize){  // todo: make the code randomly generated and unique.
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
  
  discardMember(user){        // todo: handle when group size is 0
    if(!this.members.includes(user))
      throw new Error('User is not in the group');
      
    this.members = this.members.filter((member) => member != user);

    if(user.id === this.admin.id && this.size > 0) // user is admin and there are members
      this.admin = this.members[0];   // make the next user admin

    user.groupCode = '0';
  }

  static makeGroupCode(length = 4) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    // characters += 'abcdefghijklmnopqrstuvwxyz'
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}


users.push(new User('erkutmail', 'erkut', 'erkut123', '0'));
  users.push(new User('boranmail', 'boran', 'boran123', '0'));
  users.push(new User('batuhanmail', 'batuhan' ,'batuhan123', '0'));
  users.push(new User('kadirmail', 'kadir', 'kadir123', '0'));
  users.push(new User('enesmail', 'enes', 'enes123', '0'));

g1 = new Group(users[0], 2);
g2 = new Group(users[1], 3);

groups.push(g1);
groups.push(g2);

console.log(g1, g2);

module.exports = {users, groups, User, Group};
