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
  constructor(size, users, code){
    this.size = size; //change me
    this.users = users; //members yap
    this.code =code;
  }

  addMember(user){
    this.size++;
    this.users.push(user);
    user.groupCode = this.code;
  }
  
  discardMember(user){
    this.users = this.users.filter((u) => u != user);
    this.size--;
    user.groupCode = '0';
  }
}


groups = [new Group(0, [], 'a1'), new Group(0, [], 'b2')];

const users = [
  new User('1', 'erkutmail', 'erkut', 'erkut123', '0'),
  new User('2', 'boranmail', 'boran', 'boran123', '0'),
  new User('3', 'batuhanmail', 'batuhan' ,'batuhan123', '0'),
  new User('4', 'kadirmail', 'kadir', 'kadir123', '0'),
  new User('5', 'enesmail', 'enes', 'enes123', '0')
];
groups[1].addMember(users[0]);
groups[1].addMember(users[1]);
console.log(groups[1].users);


module.exports = {users, User, Group};
