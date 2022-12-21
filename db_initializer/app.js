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

            //add first record

            const firstUserSQL = `INSERT INTO snowhill.users (id, username, email, password, groupCode, verified, totalStudyTime)` +
            `VALUES (1, "firstUser", "firstUser@gmail.com", "firstPass", "AAAA", 0, 0);`;

            db.query(firstUserSQL, function (error, result){
                if(error)
                    throw error;
                console.log("First entry for users is added");                
              });


            const groupTableSQL = `CREATE TABLE snowhill.groups (` +
            `id_groups INT NOT NULL PRIMARY KEY AUTO_INCREMENT,` +
            `groupCode VARCHAR(255),` +
            `groupName VARCHAR(255),` +
            `maxSize INT,` +
            `memberCount INT,` +
            `mondayDate DATE);`;

            db.query(groupTableSQL, function (error, result){
                if(error)
                throw error;
                console.log("Groups table created");

                const firstGroupSQL = `INSERT INTO snowhill.groups (id_groups, groupCode, groupName, maxSize, memberCount, mondayDate)` +
                `VALUES (1, "AAAA", "firstGroup", 1, 1, "2022-01-01");`;

                db.query(firstGroupSQL, function (error, result){
                if(error)
                    throw error;
                console.log("First entry for groups is added");                
                });
                
              });

          });        
        
        });
        
    });
    
});