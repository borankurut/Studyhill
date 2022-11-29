const secretKey = 'ufwdjsla';

function encodeRegistrationToken(user)
{
    // jsonweb automatically adds a key that determines the time, but you can use any module
    const jwt = require('jsonwebtoken');

    // The information we need to find our user in the database (not sensible info)
    let info = {id: user.id};

    // The hash we will be sending to the user
    const token = jwt.sign(info, secretKey);

    return token;
}

function decodeRegistrationToken(token)
{   
    const jwt = require('jsonwebtoken');
    let decoded = jwt.verify(token, secretKey);

    let userId = decoded.id;

    // Check that the user didn't take too long
    let dateNow = new Date();
    let tokenTime = decoded.iat * 1000;

    // Two hours
    let minutes = 120;    
    let tokenLife = minutes * 60 * 1000;

    // User took too long to enter the code
    if (tokenTime + tokenLife < dateNow.getTime())
    {
        return {expired: true};
    }
    // User registered in time
    return {userId};
}

const bcrypt = require('bcryptjs');

async function cryptPassword(password) {
  return await bcrypt.hash(password, 8);
}

async function comparePassword(password, hashed) {
  const result = await bcrypt.compare(password, hashed);
  return result;
}

module.exports = {encodeRegistrationToken, decodeRegistrationToken, cryptPassword, comparePassword};
