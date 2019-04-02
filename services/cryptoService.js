const bcrypt = require('bcrypt');
const config = require('../config');

/**
 * generates hash for the provided password
 * @param {String} password 
 */
const getHash = async (password) => {
    return await bcrypt.hash(password, config.saltRounds)
}

/**
 * Compares the painpassword to the hashed password returns true if successful
 * @param {String} plainPassword 
 * @param {String} hash 
 */
const compare = async (plainPassword, hash) => {
    return await bcrypt.compare(plainPassword, hash)
}

module.exports = {
    getHash,
    compare
}