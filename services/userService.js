// const config = require('../config');
const User = require('../models/user');

/**
* Fetches all valid users for the specifed filters provided in the arguments
* Initally the method gets all the filters appended to the baseurl followed by 
* requesting a http get call to obtain the users meta data for the search query
* @param {string} username 
* @param {string} language 
* @param {number} count 
* @param {number} pageIndex 
*/
const getAllUsers = async (currentUserEmail ,page, per_page) => {
    const users = await User.find({emailId:{$nin:[currentUserEmail]}},{emailId:1,name:1})
                            .skip(page*per_page)
                            .limit(per_page).exec();
    return users
}

/**
 * Adding new user to the db, fails if emailId already exists in the db else returs success
 * @param {*} userInfo 
 */
const addUser = async (userInfo) => {
    await User.create(userInfo);
    return;
}

/**
 * Fetches the userinfo for the provided emailID. Its not expected to have mutiple users. 
 * @param {*} emailId 
 */
const getUserInfo = async (emailId) => {
    const res = await User.find({emailId : emailId}).exec();
    return res;
}

module.exports = {
    getAllUsers,
    addUser,
    getUserInfo,
};

