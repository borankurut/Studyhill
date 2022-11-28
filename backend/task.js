class Task{
  constructor(name){
    this.name = name;
    this.completed = false;
  }

  complete(){this.completed = true;}
}

module.exports = {Task};
