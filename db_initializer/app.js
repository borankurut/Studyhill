const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    db.query("CREATE DATABASE snowhill", function (err, result) {
        if (err) throw err;
        console.log("Database created");
      
        db.query("alter user 'root'@'localhost' identified with mysql_native_password by '1234'", function (err, result) {
        if (err) throw err;
        console.log("User altered and password to db is 1234");

        const userTableSQL = `CREATE TABLE snowhill.users (` +
        `id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,` +
        `username VARCHAR(255),` +
        `email VARCHAR(255),` +
        `password VARCHAR(255),` +
        `groupCode VARCHAR(255),` +
        `verified INT,` +
        `totalStudyTime INT NOT NULL default 0);`;

        db.query(userTableSQL, function (error, result){
            if(error)
            throw error;
            console.log("User table created");
          });

        //TODO: create group table

        
        
        });
        
    });
    
});

//alter user 'root'@'localhost' identified with mysql_native_password by '1234';

