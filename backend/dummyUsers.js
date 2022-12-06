// sample users data moved here.
const dummy1 = {
  verification: true,
  username: "KaraMurat",
  hasGroup: false,
  groupName: "",
  tasks: [
    "Study Software Engineering lecture for 2 hours",
    "Read a book for 1 hour",
  ],
  weeklyGoal: 5,
  weeklyHours: {
    monday: 4,
    tuesday: 3,
    wednesday: 5,
    thursday: 3,
    friday: 6,
    saturday: 4,
    sunday: 1,
  },
  badgesEarned: ["badge1", "badge2", "badge3", "badge4"],
  // A unique id for each devices to remember login.
  // This id will be stored in local store. In home page request if
  // unique id of this device for the username (request will be
  // sent with username)
  // correct, then user will login automatically.
  uniqeDeviceID: "ASDFA0000FDF1223",
}; // These are what i remember. Of course we can add more information to send}


  // Checking uniqueDeviceID and username
  // _________ _______  ______   _______
  // \__   __/(  ___  )(  __  \ (  ___  )
  //    ) (   | (   ) || (  \  )| (   ) |
  //    | |   | |   | || |   ) || |   | |
  //    | |   | |   | || |   | || |   | |
  //    | |   | |   | || |   ) || |   | |
  //    | |   | (___) || (__/  )| (___) |
  //    )_(   (_______)(______/ (_______)

  // The rest same as login post
  
  const dummy2 = {
    verification: true,
    username : 'KaraMurat',
    hasGroup: false,
    groupName: "",
    tasks: [
      "Study lecture Software Engineering for 2 hours",
      "Study lecture Programming Languages for 2 hours",
      "Read a book for 1 hour",
      "jogging for half an hour",
    ],
    weeklyGoal: 3,
    weeklyHours: {
      monday: 4,
      tuesday: 6,
      wednesday: 5,
      thursday: 3,
      friday: 6,
      saturday: 4,
      sunday: 2,
    },
    badges: ["my badge 1", "my badge 2", "my badge 3", "my badge 4"],
    uniqeDeviceID: "ASDFA0000FDF1223",
  };

//============================================================================

/*
 *
 * ███████╗████████╗██╗   ██╗██████╗
 * ██╔════╝╚══██╔══╝██║   ██║██╔══██╗
 * ███████╗   ██║   ██║   ██║██████╔╝
 * ╚════██║   ██║   ██║   ██║██╔══██╗
 * ███████║   ██║   ╚██████╔╝██████╔╝
 * ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝
 *
 * Login Post method will be handled by this function. But for now
 * its is here to just debugging front-end login page.
 *
 */
/*
app.post("/login", (req, res) => {
  // Print request body for debugging.
  console.log(req.body);

  // There must be some checking that whether email given exists
  // or not, which is job of backend, that i will skip for now.
  // _________ _______  ______   _______
  // \__   __/(  ___  )(  __  \ (  ___  )
  //    ) (   | (   ) || (  \  )| (   ) |
  //    | |   | |   | || |   ) || |   | |
  //    | |   | |   | || |   | || |   | |
  //    | |   | |   | || |   ) || |   | |
  //    | |   | (___) || (__/  )| (___) |
  //    )_(   (_______)(______/ (_______)

  // Generate unique device id for user and store it in an array for user device ids

  // Returning response to client
  // -----------------------------
  // An object that has informations of the user, if that user exists,
  // and verification value, that can be eighter true or false.
  // Front-end will process respect to the verification.
  // If verification is true, then client will been navigate to profile page.
  // Else there will be an alert that there is no such user exists to client
  const user = dummy1;
  res.json(user); // Send user in JSON format as response to client.
});
*/
// If there is stored username and devicedID, then client post this values
// as an object to server to check whether this username exist or not.
// And gets a response that consists of data of the user.

console.log(dummy1, dummy2);
module.exports = {dummy1, dummy2};
