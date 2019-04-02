const userService = require('../services/userService');
const utils = require('../utils/utils');
const authService = require('../services/authService');
const config = require('../config');
const crypto = require('../services/cryptoService')

/**
* to obtain all the registered users info, the request is already auth verified and 
* expected to contain the current users emaild hence we return all the available users except him
* status code:500 is some error occurs during fetch
* status code:200 is for success provides the number of users and the users info (name and emailId)
* 
* @param {object} req 
* @param {object} res 
*/
const getAllUsersInfo = async (req, res) => {
    console.log("auth successfully verified:",req.emailId)
    if(typeof req.emailId === 'undefined'){
        res.status(403).send({message:'forbidden'});
        return;
    }
    const page = parseInt(req.query.page) || config.defaultPageNumber
    const per_page = parseInt(req.query.per_page) || config.maxUsersPerPage
    try{
        const usersInfo = await userService.getAllUsers(req.emailId, page, per_page)
        const responseJSON = { pageNumber: page, userCount: usersInfo.length, users: usersInfo }
        res.status(200).send({response:responseJSON});
    }catch(error){
        res.status(500).send({message:"internal server error"})
    }
}

/**
 * Logs in the user, the credentials are extracted from the body and compared agnaist the db values,
 * the password hash is compared using bcrypt. 
 * if credentials are found valid then a JWT token is generated for the user and returned as a part of response
 * returns 200 on success along with tokenID
 * retuns 400 on failure with invalid credntials message
 * @param {*} req 
 * @param {*} res 
 */
const login = async (req, res) => {
    if(utils.validateObject(req.body, ['emailId', 'password'])){
        try{
            const userInfo = await userService.getUserInfo(req.body.emailId.toLowerCase())
            if(userInfo.length > 0){
                const comparePwd = await crypto.compare(req.body.password, userInfo[0].hash)
                if(comparePwd){
                    const tokenId = await authService.createAuthToken({emailId: userInfo[0].emailId})
                    res.status(200).send({tokenId:tokenId});
                    return;
                }
            }else{
                throw Error('invalid credentials')
            }       
        } catch (error) {
            res.status(400).send(error)
        }
    }else{
        res.status(400).send({message:"username or password missing"})
    } 
}

/**
 * Signing up a user to the service. The password's hash is stored in the db. The emailId is considered unique.
 * It's not allowed for someone else to join with the same mailId. 
 * EmailId regex is handled as well. 
 * retuns 200 on successful addition of the user to db
 * retuns 400 is some error occurs
 * @param {*} req 
 * @param {*} res 
 */
const addUser = async (req, res) => {
    console.log("add user body:",req.body);
    if(utils.validateObject(req.body, ['emailId', 'name', 'password'])){
        try{
            const pwdHash =  await crypto.getHash(req.body.password)
            const userInfo = {name:req.body.name, emailId: req.body.emailId, hash: pwdHash}
            await userService.addUser(userInfo)
            res.status(200).send({message:"user added successfully"});
        }catch (error) {
            res.status(400).send(error);    
        }
    } else {
        res.status(400).send({message:"fields missing"})
    }
}

module.exports = {
    getAllUsersInfo,
    login,
    addUser
}